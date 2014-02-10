
var _ = require('underscore');
var twitter = require('ntwitter');

module.exports = function(config) {
  var controller = {
    sockets: [],
    next_user: 'laurmccarthy' // pend temp for testing
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
        'content':data
      }); 
    }
  };

  return controller;
};