
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
var requests = [];

module.exports = function(config, io) {
 
  var default_user = '*DEFAULT*';

  var controller = {
    io: io,
    cur_user: null,
    queued_users: [default_user, 'kcimc', 'FunnyVines', 'laurmccarthy'], // pend temp for testing
    storage: require('./storage')(),
    start_time: 0,
    run_time: 60*1000, // pend temp
    error: null // for status ping
  };
  

  var twit = new twitter(config.creds);

  twit.stream('statuses/filter', {track:'#sstest'}, function(stream) {
    stream.on('data', function (data) {
      controller.queued_users.push(data.user.screen_name);
      console.log('queueing user '+data.user.screen_name);
    });
  });

  // manual override of next user, triggered by controller app
  controller.queueUser = function(user) {

    var match = _.filter(controller.queued_users, function(u) { return ~u.toLowerCase().indexOf(user.toLowerCase())});
    console.log(match);
    if (!match.length > 0) {
      controller.queued_users.push(user);
      console.log('queueing user '+user);
    } else console.log('user '+user+' already in queue');
  };

  // go message received from controller app
  // determines next user, does cleanup, then calls start
  controller.trigger = function(user, callback) {

    var is_def = user === default_user;
    if (is_def) {
      console.log(controller.storage);
      var defs = controller.storage.default_users;
      user = defs[Math.floor(Math.random()*defs.length)];
      console.log('choosing default user: '+user);
    }
      
    // CLEANUP
    // remove queued tasks
    while(queue.length() > 0) {
      queue.tasks.pop();
    }

    // destroy pending requests
    for (var i=0; i<requests.length; i++) {
      requests[i].destroy();
    }
    requests = [];

    // START NEW
    console.log('start with user '+user);
    controller.start_time = new Date();
    controller.cur_user = user;
    controller.queued_users = _.without(controller.queued_users, user); 

    getPerson(user, true, !is_def, callback);

  }


  controller.buildDb = function() {

    fs.remove(assets_root+'mentors/', function(err) {
      fs.readJson('./data/mentors.json', function(err, data) {
        controller.storage.reset(function() {
          async.eachSeries(data, function(mentor, cb) {
            getPerson(mentor.user, false, false, cb);
          }, function () {
            controller.storage.updateDefaultUsers();
            console.log('downloaded ');
          });
        });
      });
    });

  };

  controller.getRemaining = function() {
    return Math.max(0, controller.run_time - (new Date() - controller.start_time));
  };

  function getPerson(user, live, send_tweet, cb) {
    var dir = assets_root+'mentors/'+user+'/';
    console.log('grabbing tweets for '+user);

    twit.getUserTimeline({screen_name:user}, function(err, data) { 
      // render controller once user status is known
      if (err) {
        console.log(err);
        if (err.statusCode === 404) {
          controller.error = 'User '+user+' does not exist.';
        } else {
          controller.error = 'Something went wrong, please try again. ('+err+')';
        }
      } else {

        controller.error = null; 

        if (live) {
          // alert listeners to start
          controller.io.sockets.emit('trigger', {
            'user':user,
            'tweets':data
          }); 
        }


        // insert text in db
        console.log('inserting '+user+' in db');
        
        var obj = { 
          user: user,
          text: concat_tweets(data),
          name: data[0].user.name
        };
        controller.storage.insert(obj);

        // analyze tweets
        if (live) findMentor(user, obj.text, send_tweet);

        // save json
        fs.outputJson(dir+'timeline.json', data, function(e){ if (e) console.log(e); });
        // download media

        fs.remove(dir, function() {
          fs.mkdirs(dir, function() {
            downloadMedia(dir, data, function(res) { 
              console.log('downloaded '+res+' remaining: '+queue.length()+' reqs: '+requests.length); 
              cb();
            });
          });    
        });
      }

    });
  }

  function downloadMedia(dir, data, callback) {

    // get profile pic
    if (data.length > 0) {
      var profile = data[0].user.profile_image_url.replace('_normal', '');
      queue.push({dir:dir, url:profile, tag:'profile'}, callback);
      queue.push({dir:dir, url:data[0].user.profile_background_image_url, tag:'background'}, callback);
    }
    

    // download media
    for (var i=0; i<data.length; i++) {

      var media = data[i].entities.media;
      if (media) {
        for (var j=0; j<media.length; j++) {
          queue.push({dir:dir, url:media[j].media_url}, callback);
        }
      }
      var urls = data[i].entities.urls;
      if (urls) {
        for (var j=0; j<urls.length; j++) {
          if (urls[j].expanded_url.indexOf('vine.co') !== -1) {
            queue.push({dir:dir, url:urls[j].expanded_url}, callback);
          } else {
            scrape(dir, urls[j].expanded_url, callback);
          }
        }
      }
    }
  }

  function scrape(dir, uri, callback) {
    beagle.scrape(uri, function(err, bone){
      if (err) console.log('b err', uri);
      if (bone) {
        for (var i=0; i<bone.images.length; i++) {
          queue.push({dir:dir, url:bone.images[i]}, callback);
        }
      } 
    });
  }

  //Set up our queue
  var queue = async.queue(function(obj, callback) {

    var filename = obj.dir+obj.url.substring(obj.url.lastIndexOf('/')+1);
    if (obj.url.indexOf('vine.co') != -1) {
      var vine_id = obj.url.substring(obj.url.lastIndexOf('/')+1);  
      vine.download(vine_id, {dir: obj.dir, success: callback});
    } else {
      var req = request(obj.url).pipe(fs.createWriteStream(filename)).on('close', function(err) {
        if (req.bytesWritten > 4000) { // only send if bigger than 4kb
          controller.io.sockets.emit('asset', {
            'file':filename,
            'tag':obj.tag
          }); 
        }
        callback(filename);
      }).on('error', function(err) {
        console.log('Error caught and ignored: ' +err);
        callback(filename);
      });
      requests.push(req);
    } 
  }, 1); //Only allow 1 request at a time

  //When the queue is emptied we want to check if we're done
  queue.drain = function() {
    if (queue.length() == 0 ) { //&& listObjectsDone) {
      console.log('ALL files have been downloaded');
    }
  };

  function findMentor(user, text, send_tweet) {

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
      if (send_tweet) {
       //setTimeout(function(){ sendEndTweet(user, highKey); }, 120*1000); //pend: out for now until launch
      }
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
      controller.io.sockets.emit('mentor', {
        'user':name,
        'content':data
      }); 
    });
  }

  function sendEndTweet(user, name) {
    twit.updateStatus('@'+user+' your social soulmate is @'+name,
      function(err) {console.log(err); });
  }

  return controller;
};