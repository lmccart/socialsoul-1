
module.exports = function(config) {
  var logic = {};
  

  var twit = new twitter(config.creds);

  twit.stream('statuses/filter', {track:'#sstest'}, function(stream) {
    stream.on('data', function (data) {
      logic.next_user = data.user.screen_name;
      console.log('next user set to '+logic.next_user);
    });
  });

  // manual override of next user, triggered by controller app
  logic.setNextUser = function(user) {
    logic.next_user = user;
    console.log('next user set to '+logic.next_user);
  };

  // go message received from controller app
  // starts system with queued up next_user
  logic.start = function() {
    logic.cur_user = logic.next_user;
    logic.next_user = null;
  }


  return logic;
};