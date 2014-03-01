
var _ = require('underscore')
  , twitter = require('ntwitter')
  , request = require('request')
  , fs = require('fs-extra')
  , _ = require('underscore')
  , async = require('async')
  , beagle = require('beagle')
  , natural = require('natural')
  , similarity = require('./similarity')
  , vine = require('./vinegrab');

var assets_root = './public/assets/';


module.exports = function(config) {
  var controller = {
    sockets: [],
    cur_user: null,
    queued_users: ['laurmccarthy'], // pend temp for testing
    storage: require('./storage')(),
    start_time: 0,
    run_time: 60*1000 // pend temp
  };

  var twit = new twitter(config.creds);

  twit.stream('statuses/filter', {track:'#sstest'}, function(stream) {
    stream.on('data', function (data) {
      controller.queued_users.push(data.user.screen_name);
      console.log('queueing user '+data.user.screen_name);
    });
  });

  controller.addSocket = function(s) {
    if (!_.contains(controller.sockets, s)) {
      controller.sockets.push(s);
    }
  };

  // manual override of next user, triggered by controller app
  controller.queueUser = function(user) {
    if (_.indexOf(controller.queued_users, user) === -1) {
      controller.queued_users.push(user);
      console.log('queueing user '+user);
    } else console.log('user '+user+' already in queue');
  };

  // go message received from controller app
  // starts system with queued up next_user
  controller.start = function(user) {

    controller.start_time = new Date();

    // remove and create new dir if necessary
    if (controller.cur_user !== user) {
      fs.remove(assets_root+controller.cur_user+'/');
      fs.mkdirpSync(assets_root+user+'/');
    }

    console.log('start with user '+user);
    controller.cur_user = user;
    controller.queued_users = _.without(controller.queued_users, user); 

    // grab timeline and media
    twit.getUserTimeline({screen_name:user},
      function(err, data) { 
        if (err) console.log(err); 
        // alert listeners to start
        for (var i=0; i<controller.sockets.length; i++) {
          controller.sockets[i].emit('trigger', {
            'user':user,
            'tweets':data
          }); 
        }

        downloadMedia(assets_root+user+'/', data);

        // analyze tweets
        data = concat_tweets(data);
        findMentor(user, data);
      });
  };

  controller.buildDb = function() {

    fs.removeSync(assets_root+'mentors/')
    var data = fs.readJsonSync('./data/mentors.json');

    async.eachSeries(data, function(mentor, cb) {

      var dir = assets_root+'mentors/'+mentor.user+'/';
      console.log('grabbing tweets for '+mentor.user);
      twit.getUserTimeline({screen_name:mentor.user},
        function(err, data) { 
          if (err) console.log(err); 

          // insert text in db
          console.log('inserting '+mentor.user+' in db');
          mentor.text = concat_tweets(data);
          controller.storage.insert(mentor);

          // save json
          fs.outputJson(dir+'timeline.json', data, function(e){ if (e) console.log(e); });
          // download media

          fs.mkdirpSync(dir);
          downloadMedia(dir, data, function() { cb(err);});

      });
    }, function (err) {
      console.log('totes done');
    });



  };

  controller.getRemaining = function() {
    return Math.max(0, controller.run_time - (new Date() - controller.start_time));
  };

  function downloadMedia(dir, data, cb0) {
    // download media
    async.eachSeries(data, function(tweet, cb1) {
      var entities = [];

      var media = tweet.entities.media;
      if (media) {
        for (var j=0; j<media.length; j++) {
          entities.push({path:media[j].media_url, type:'img'});
        }
      }
      var urls = tweet.entities.urls;
      if (urls) {
        for (var j=0; j<urls.length; j++) {
          entities.push({path:urls[j].expanded_url, type:'url' });
        }
      }

      async.eachSeries(entities, function(entity, cb2) {
        if (entity.type === 'img' || entity.path.indexOf('vine') !== -1) {
          downloadFile(dir, entity.path, function() { cb2(); });
        } else {
          scrape(entity.path, dir, function(){console.log('scraped '); cb2(); });
        }
      }, function() {
        console.log('done with tweet');
        cb1();
      });
    }, function() {
      console.log('done with TWEETS '+dir);

      // send assets to client once they're collected
      var assets = fs.readdirSync(dir);
      for (var i=0; i<controller.sockets.length; i++) {
        controller.sockets[i].emit('assets', {
          'dir':dir,
          'files':assets
        }); 
      }

      if (cb0) cb0();
    });
  }


  function downloadFile(dir, d, callback) {
    var filename = dir+d.substring(d.lastIndexOf('/')+1);
    if (d.indexOf('vine') != -1) {
      var vine_id = d.substring(d.lastIndexOf('/')+1);  
      vine.download(vine_id, {dir: filename, success: callback});
    } else {
      request.head(d, function (err, res, body) {
        request(d).pipe(fs.createWriteStream(filename)).on('close', function(err) {
          callback(err);
        });
      });
    } 
  }

  function scrape(uri, dir, cb0) {
    beagle.scrape(uri, function(err, bone){
      if (err) console.log('b err', uri);
      if (bone) {
        async.eachSeries(bone.images, function(img, cb1) {
          downloadFile(dir, img, function(){ cb1(); });
        }, function() { cb0(); });
      } else cb0();
    });
  }


  function findMentor(user, text, save) {

    // pick related mentor
    var low = 0, lowKey = '';
    var high = 0, highKey = '';

    controller.storage.all(function(err, data) {
      for (var i=0; i<data.length; i++) {
        if (data[i].user != user) {
          var rating = similarity.tokenCosineSimilarity(text, data[i].text);
          console.log(data[i].user+' '+rating);
          if(low == 0 || rating < low) {
            low = rating;
            lowKey = data[i].user;
          }
          if(high == 0 || rating > high) {
            high = rating;
            highKey = data[i].user;
          }
        }
      }
      console.log(highKey + " similarity " + high);
      sendMentor(highKey);
    });

  }

  function concat_tweets(data) {
    var text = '';
    for (var i=0; i<data.length; i++) {
      text += data[i].text+' ';
    }
    text = normalize(text);
    return text;
  }

  function normalize(text) {
    natural.LancasterStemmer.attach();
    // maybe need to remove urls too
    return text.tokenizeAndStem();
  }

  function sendMentor(name) {
    console.log('sending mentor '+name);
    //controller.next_user = null; // pend temp

    fs.readJson(assets_root+'mentors/'+name+'/timeline.json', function(err, data) {
      for (var i=0; i<controller.sockets.length; i++) {
        controller.sockets[i].emit('mentor', {
          'user':name,
          'content':data
        }); 
      }
    });
  }

  return controller;
};