
var _ = require('underscore')
  , twitter = require('ntwitter')
  , request = require('request')
  , fs = require('fs')
  , beagle = require('beagle')
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

        // download media
        for (var i=0; i<data.length; i++) {
          var media = data[i].entities.media;
          if (media) {
            for (var j=0; j<media.length; j++) {
              controller.download(media[j].media_url, function(){console.log('downloaded ');});
            }
          }
          var urls = data[i].entities.urls;
          if (urls) {
            for (var j=0; j<urls.length; j++) {
              if (urls[j].expanded_url.indexOf('vine') !== -1) {
                var vine_id = urls[j].expanded_url.substring(urls[j].expanded_url.lastIndexOf('/')+1);
                vine.download(vine_id, {dir: './assets/'});
              } else {
                controller.scrape(urls[j].expanded_url, function(){console.log('scraped ');});
              }
            }
          }
          // console.log(data[i].entities.urls);
          // console.log(data[i].entities.media);
        }
        // analyze tweets
        controller.analyze(data);
      });
  };

  controller.analyze = function(data) {
    // analyze tweets
    for (var i=0; i<data.length; i++) {

    }
    // pick related mentor

    // send mentor
    controller.sendMentor('name');

    // archive new user
  };

  controller.sendMentor = function(mentor) {
    console.log('sending mentor '+mentor);
    //controller.next_user = null;
    for (var i=0; i<controller.sockets.length; i++) {
      controller.sockets[i].emit('mentor', {
        'user':mentor,
        'content':null // pend for now
      }); 
    }
  };


  controller.scrape = function(uri, callback) {
    beagle.scrape(uri, function(err, bone){
      for (var i=0; i<bone.images.length; i++) {
        controller.download(bone.images[i], function(){console.log('d');});
      }
    });
  }

  controller.download = function(uri, callback){
    request.head(uri, function(err, res, body){
      var time = new Date().getTime();
      var filename = 'assets/'+time+'.png';
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

  return controller;
};