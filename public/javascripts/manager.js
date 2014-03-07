var Manager = function() {

  var module = {
    modes: [
      new DebugMode(),
      new EnterMode(),
      new CenteredTextMode(),
      new BreakMode,
      new ExitMode()
    ],
    cur_mode: 0,
    last_start: 0,
    started: false
  };

  module.sync = function() {
    // any pre-user setup goes here
    module.goToMode(2);
  }

  module.init = function(data) {
    // any per-user setup goes here
    for (var i=0; i<module.modes.length; i++) {
      module.modes[i].files = [];
      module.modes[i].user = data.user;
      module.modes[i].tweets = data.tweets;
    }
    module.goToMode(1);
    module.started = true;
  };

  module.addAssets = function(data) {
    for (var i=0; i<module.modes.length; i++) {
      module.modes[i].dir = data.dir.replace('./public', '..');
      module.modes[i].files = data.files;
      // console.log(i+' '+module.modes[i].dir);
    }
    // module.goToMode(0);
  };

  module.addAsset = function(data) {
    // module.goToMode(0);

    // console.log(module.files);
    for (var i=0; i<module.modes.length; i++) {
      // console.log(data.file.replace('./public', '..'));
      var file = data.file.replace('./public', '..');
      module.modes[i].files.push(file);
      // console.log(i+' '+file);
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
    if(module.modes[module.cur_mode].update != undefined) {
      module.modes[module.cur_mode].update();
    }
  }

  module.goToMode = function(ind) {
    if (module.cur_mode == ind) {
      console.log("already in mode");
      return;
    }
    if (ind >= 0 && ind < module.modes.length) {
      if(module.started) {
        module.last_start = new Date().getTime();
        module.modes[module.cur_mode].exit();
      }
      $('body').empty();
      module.cur_mode = ind;
      module.modes[module.cur_mode].init();
      console.log('init mode '+module.cur_mode);
    } else {
      console.log('mode '+ind+' out of bounds');
    }
  }

  return module;
};

