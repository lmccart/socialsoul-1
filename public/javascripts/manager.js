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

  function getCurrentMode() {
    return modes[settings.playlist[playlistPosition].mode];
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

    module.goToMode(0);
    triggerTime = ServerTime.now();
    playing = true;
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

  module.update = function() {
    var elapsed = ServerTime.now() - triggerTime;
    var currentPosition = 0;
    var minimumTime = 0;
    for(var i = 0; i < settings.playlist; i++) {
      currentPosition = i;
      minimumTime += settings.playlist[i].duration;
      if(elapsed > minimumTime) {
        break;
      }
    }
    module.goToMode(currentPosition);
    getCurrentMode().update(getCurrentUser());

    // an idea for speeding up/slowing down the timeout
    // var timeout = module.modes[module.cur_mode].timeout;
    // if(timeout) {
    //   timeout.timeoutLength *= (1-.001); // subject-side
    //   timeout.timeoutLength *= (1+.002); // mentor-side
    // }
  }

  module.goToMode = function(index) {
    if (index != playlistPosition && index >= 0 && index < settings.playlist.length) {
      if(playing) {
        getCurrentMode().exit(); 
      }
      $('body').empty();
      playlistPosition = index;
      getCurrentMode().init(getCurrentUser());
      console.log('init mode '+settings.playlist[playlistPosition].mode);
    }
  }

  return module;
};

