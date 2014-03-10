// manager keeps track of all the modes

var subject = new User();
var mentor = new User();

var Manager = function() {

  var module = {
    modes: [
      // new DebugMode(),

      // subject
      // new EnterMode(),
      // new TweetMode(),
      // new AllImagesMode(),
      // new CenteredTextMode(),
      // new BreakMode(),

      // mentor
      new CenteredTextMode(),
      new AllImagesMode(),
      new TweetMode(),
      new ExitMode(),

      // new ThreeMode(),
      // new TextillateMode(),
    ],
    cur_mode: 0,
    last_start: 0,
    started: false
  };

  module.sync = function() {
    // any pre-user setup goes here
    // module.goToMode(2);
  }

  module.trigger = function(data) {
    // reset everything
    module.started = false;
    module.cur_mode = module.modes.length-1;
    for (var i=0; i<module.modes.length; i++) {
      module.modes[i].exit();
    }

    subject = new User();
    subject.user = data.user;
    subject.tweets = data.tweets;
    subject.cleanTweets();

    mentor = new User();

    module.goToMode(0);
    module.started = true;
  };

  module.addAsset = function(data) {
    if(data.is_mentor) {

    } else {
      // better way to do this might be sending json like
      // {subject: {profile: filename, background: filename}}
      // then we can just loop through properties and copy them over
      // using .push if they already exist
      if(data.tag == "profile") {
        subject.profile = data.file;
      } else if(data.tag == "background") {
        subject.background = data.file;
      } else {
        subject.files.push(data.file);
      }

      module.modes[module.cur_mode].next(subject);
    }
  };

  module.update = function() {
    if (module.started) {
      var elapsed = new Date() - module.last_start;
      if (elapsed > 12000) {
        module.goToMode(module.cur_mode + 1);
      }
    }
    module.modes[module.cur_mode].update(subject);
    var timeout = module.modes[module.cur_mode].timeout;
    if(timeout) {
      // timeout.timeoutLength *= (1-.001); // subject-side
      timeout.timeoutLength *= (1+.002); // mentor-side
    }
  }

  module.goToMode = function(ind) {
    if (module.cur_mode == ind) {
      console.log("already in mode");
      return;
    }
    if (ind >= 0 && ind < module.modes.length) {
      if(module.started) {
        module.modes[module.cur_mode].exit();
      }
      $('body').empty();
      module.cur_mode = ind;
      module.modes[module.cur_mode].init(subject);
      module.last_start = new Date();
      console.log('init mode '+module.cur_mode);
    } else {
      console.log('mode '+ind+' out of bounds');
    }
  }

  return module;
};

