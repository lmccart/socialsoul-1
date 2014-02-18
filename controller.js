
var _ = require('underscore')
  , twitter = require('ntwitter')
  , request = require('request')
  , fs = require('fs-extra')
  , beagle = require('beagle')
  , natural = require('natural')
  , similarity = require('./similarity')
  , vine = require('./vidgrab');


module.exports = function(config) {
  var controller = {
    sockets: [],
    next_user: 'laurmccarthy', // pend temp for testing
    storage: require('./storage')()
  };

  var twit = new twitter(config.creds);

  twit.stream('statuses/filter', {track:'#sstest'}, function(stream) {
    stream.on('data', function (data) {
      controller.next_user = data.user.screen_name;
      console.log('next user set to '+controller.next_user);
    });
  });

  controller.addSocket = function(s) {
    if (!_.contains(controller.sockets, s)) {
      controller.sockets.push(s);
    }
  };

  // manual override of next user, triggered by controller app
  controller.setNextUser = function(user) {
    controller.next_user = user;
    console.log('next user set to '+controller.next_user);
  };

  // go message received from controller app
  // starts system with queued up next_user
  controller.start = function() {

    if (controller.cur_user && controller.cur_user != controller.next_user) {
      fs.remove('./assets/'+controller.cur_user+'/');
    }
    controller.cur_user = controller.next_user;
    console.log('start with user '+controller.cur_user);
    //controller.next_user = null;

    twit.getUserTimeline({screen_name:controller.cur_user},
      function(err, data) { 
        if (err) console.log(err); 
        for (var i=0; i<controller.sockets.length; i++) {
          controller.sockets[i].emit('trigger', {
            'user':controller.cur_user,
            'content':data
          }); 
        }

        downloadMedia(data, './assets/'+controller.cur_user+'/');

        // analyze tweets
        data = concat_tweets(data);
        findMentor(controller.cur_user, data);
      });
  };

  controller.buildDB = function() {

    fs.remove('./assets/mentors/', function() {
      fs.readJson('./data/mentors.json', function(err, data) {
        data.forEach(function(mentor) {
          console.log('building tweets for '+mentor.user);
          twit.getUserTimeline({screen_name:mentor.user},
            function(err, data) { 
              if (err) console.log(err); 

              downloadMedia(data, './assets/mentors/'+mentor.user+'/');

              data = concat_tweets(data);
              // insert into db
              console.log('inserting '+mentor.user);
              mentor.text = data;
              controller.storage.insert(mentor);
          });
        });
      });
    });
  };

  function downloadMedia(data, dir) {
    fs.mkdirs(dir, function (err) {
      if (err) console.error(err)
      else console.log('pow!')

       // download media
      for (var i=0; i<data.length; i++) {
        var media = data[i].entities.media;
        if (media) {
          for (var j=0; j<media.length; j++) {
            download(media[j].media_url, dir, function(){console.log('downloaded ');});
          }
        }
        var urls = data[i].entities.urls;
        if (urls) {
          for (var j=0; j<urls.length; j++) {
            if (urls[j].expanded_url.indexOf('vine') !== -1) {
              var vine_id = urls[j].expanded_url.substring(urls[j].expanded_url.lastIndexOf('/')+1);
              vine.download(vine_id, {dir: dir});
            } else {
              scrape(urls[j].expanded_url, dir, function(){console.log('scraped ');});
            }
          }
        }
      }
        // console.log(data[i].entities.urls);
        // console.log(data[i].entities.media);
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

  function sendMentor(mentor) {
    console.log('sending mentor '+mentor);
    //controller.next_user = null;
    for (var i=0; i<controller.sockets.length; i++) {
      controller.sockets[i].emit('mentor', {
        'user':mentor,
        'content':null // pend for now
      }); 
    }
  }

  function scrape(uri, dir, callback) {
    beagle.scrape(uri, function(err, bone){
      for (var i=0; i<bone.images.length; i++) {
        download(bone.images[i], dir, function(){console.log('d');});
      }
    });
  }

  function download(uri, dir, callback){
    request.head(uri, function(err, res, body){
      var time = new Date().getTime();
      var filename = dir+time+'.png';
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  }

  controller.buildDB();
  return controller;
};