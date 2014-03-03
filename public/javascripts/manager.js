

var Manager = function() {

  console.log('load manager ');

  var module = {
    modes: [
      new WelcomeMode(),
      new ImageMode(),
      new TweetMode()
    ],
    cur_mode: -1,
    last_start: 0,
    started: false
  };

  module.init = function(data) {
    for (var i=0; i<module.modes.length; i++) {
      module.modes[i].files = [];
      module.modes[i].user = data.user;
      module.modes[i].tweets = data.tweets;
    }
    module.goToMode(0);
    module.started = true;
  };

  module.addAssets = function(data) {
    for (var i=0; i<module.modes.length; i++) {
      module.modes[i].dir = data.dir.replace('./public', '..');
      module.modes[i].files = data.files;
      console.log(i+' '+module.modes[i].dir);
    }
    module.goToMode(1);
  };

  module.addAsset = function(data) {
    module.goToMode(1);

    console.log(module.files);
    for (var i=0; i<module.modes.length; i++) {
      console.log(data.file.replace('./public', '..'));
      var file = data.file.replace('./public', '..');
      module.modes[i].files.push(file);
      console.log(i+' '+file);
    }
    module.modes[module.cur_mode].next();
  };

  module.reset = function() {
    module.started = false;
    module.last_start = 0;
    module.cur_mode = module.modes.length-1;
    for (var i=0; i<module.modes.length; i++) {
      module.modes[i].exit();
    }
  }

  module.update = function() {
    // if (module.started) {
    //   var t = new Date().getTime();
    //   if (t - module.last_start > 20000) {
    //     var next = (module.cur_mode+1)%(module.modes.length);
    //     module.goToMode(next);
    //   }
    // }
  }

  module.goToMode = function(ind) {
    if (ind >= 0 && ind < module.modes.length && module.cur_mode !== ind) {
      module.last_start = new Date().getTime();
      module.modes[module.cur_mode].exit();
      module.cur_mode = ind;
      module.modes[module.cur_mode].play();
      console.log('playing mode '+module.cur_mode);
    } else console.log('mode '+ind+' out of bounds or already in mode');
  }



  return module;
};

