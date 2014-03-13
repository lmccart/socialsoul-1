// manager keeps track of all the modes

var Manager = function() {

  var module = {};

  var modes = {
    debug: new DebugMode(),

    enter: new EnterMode(),
    tweet: new TweetMode(),
    allImages: new AllImagesMode(),
    centeredText: new CenteredTextMode(),
    bridge: new BridgeMode(),
    exit: new ExitMode()

    // new ThreeMode(),
    // new TextillateMode(),
  };
  var users, playlistPosition, triggerTime, playing;

  function reset() {
    if(playing) {
      getCurrentMode().exit();
    }
    playlistPosition = 0;
    triggerTime = 0;
    playing = false;
    users = {
      subject: new User(),
      mentor: new User()
    }
  }
  reset();

  function getCurrentModeName() {
    return settings.playlist[playlistPosition].mode;
  }

  function getCurrentMode() {
    return modes[getCurrentModeName()];
  }

  function getCurrentDuration() {
    return settings.playlist[playlistPosition].duration;
  }

  function getCurrentUser() {
    return users[settings.playlist[playlistPosition].user];
  }

  // any pre-user setup goes here
  module.sync = function() {
  }

  module.trigger = function(data) {
    reset();

    users.subject.user = data.user;
    users.subject.tweets = data.tweets;
    users.subject.cleanTweets();

    tts.init(data.tweets);

    // setup playlist
    var totalDuration = 0;
    for(var i = 0; i < settings.playlist.length; i++) {
      settings.playlist[i].timeout =
        setTimeout((function(index){
          return function() {
            console.log("calling setPlaylistPosition " + index);
            module.setPlaylistPosition(index);
          }
        })(i), totalDuration * 1000);
      console.log("function setPlaylistPosition " + i + " @ " + totalDuration);
      totalDuration += settings.playlist[i].duration;
    }
    triggerTime = ServerTime.now();
  };

  module.addAsset = function(data) {
    // better way to do this might be sending json like
    // {subject: {profile: filename, background: filename}}
    // then we can just loop through properties and copy them over
    // using .push if they already exist
    if(data.is_mentor) {

    } else {
      if(data.tag == "profile") {
        users.subject.profile = data.file;
      } else if(data.tag == "background") {
        users.subject.background = data.file;
      } else {
        users.subject.files.push(data.file);
      }
      getCurrentMode().next(getCurrentUser());
    }
  };

  module.setPlaylistPosition = function(index) {
    if (index >= 0 && index < settings.playlist.length) {
      if(playing) {
        console.info('exit mode ' + getCurrentModeName());
        getCurrentMode().exit();
      }
      $('body').empty();
      playlistPosition = index;
      getCurrentMode().init(getCurrentUser());
      console.info('init mode ' + getCurrentModeName());
    }
  }

  return module;
};

