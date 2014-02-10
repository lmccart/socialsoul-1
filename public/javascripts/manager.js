

var Manager = function() {

  console.log('load manager ');

  var module = {
    modes: [
      new TestMode(),
      new OtherTestMode()
    ]
  };

  module.init = function(data) {
    for (var i=0; i<module.modes.length; i++) {
      module.modes[i].data = data.message;
    }
    module.playAll();
  };

  module.playAll = function() {
    for (var i=0; i<module.modes.length; i++) {
      module.modes[i].play();
    }
  }

  return module;
};
