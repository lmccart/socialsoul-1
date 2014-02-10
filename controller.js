
var twitter = require('ntwitter');

module.exports = function(config) {
  var controller = {};
  controller.next_user = 'laurmccarthy'; // pend temp testing
  

  var twit = new twitter(config.creds);

  twit.stream('statuses/filter', {track:'#sstest'}, function(stream) {
    stream.on('data', function (data) {
      controller.next_user = data.user.screen_name;
      console.log('next user set to '+controller.next_user);
    });
  });

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

    twit.getUserTimeline('screen_name=laurmccarthy',
      function(data, err) { if (err) console.log(err); console.log(data); });
  }    

  return controller;
};