

var Manager = function() {

  console.log('load manager ');

  var module = {
    modes: [
      new TestMode(),
      new OtherTestMode()
    ],
    cur_mode: -1,
    last_start: 0,
    started: false
  };

  module.init = function(data) {
    module.cur_mode = module.modes.length-1;
    for (var i=0; i<module.modes.length; i++) {
      module.modes[i].user = data.user;
      module.modes[i].content = data.content;
    }
    module.started = true;
  };

  module.update = function() {
    if (module.started) {
      var t = new Date().getTime();
      if (t- module.last_start > 20000) {
        module.last_start = t;
        module.modes[module.cur_mode].exit();
        module.cur_mode = (module.cur_mode+1)%(module.modes.length)
        module.modes[module.cur_mode].play();
        console.log('playing mode '+module.cur_mode);
      }
    }
  }



  return module;
};

