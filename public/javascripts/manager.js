// manager keeps track of all the modes

var users;

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
  var playlistPosition, triggerTime, playing;

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

  function getCurrentScene() {
    return settings.playlist[playlistPosition];
  }

  function getCurrentModeName() {
    return getCurrentScene().mode;
  }

  function getCurrentMode() {
    return modes[getCurrentModeName()];
  }

  function getCurrentDuration() {
    return getCurrentScene().duration;
  }

  function getCurrentUser() {
    return users[getCurrentScene().user];
  }

  // any pre-user setup goes here
  module.sync = function() {
  }

  module.trigger = function(data) {
    reset();
    users.subject.loadData(data);
    tts.init(data.tweets);

    // setup playlist
    var totalDuration = 0;
    for(var i = 0; i < settings.playlist.length; i++) {
      if(settings.playlist[i].timeout) {
        clearTimeout(settings.playlist[i].timeout);
      }
      settings.playlist[i].timeout =
        setTimeout((function(index){
          return function() {
            module.setPlaylistPosition(index);
          }
        })(i), totalDuration * 1000);
      totalDuration += settings.playlist[i].duration;
    }
    triggerTime = ServerTime.now();
  };

  module.mentor = function(data) {
    users.mentor.loadData(data);
  }

  module.addAsset = function(data) {
    // better way to do this might be sending json like
    // {subject: {profile: filename, background: filename}}
    // then we can just loop through properties and copy them over
    // using .push if they already exist
    var user = data.is_mentor ? users.mentor : users.subject;
    if(data.tag == "profile") {
      user.profile = data.file;
    } else if(data.tag == "background") {
      user.background = data.file;
    } else if(data.tag == "friend") {
      user.friends.push(data.file);
    } else {
      user.files.push(data.file);
    }
    if(playing) {
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
      if(getCurrentScene().callback && screenId == 0) {
        getCurrentScene().callback();
      }
      playing = true;
      console.info('init mode ' + getCurrentModeName());
    }
  }

  return module;
};

