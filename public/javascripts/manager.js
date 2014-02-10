

define([
  // put all the mode modules here!
  'testMode',
  'otherTestMode'
],

function() {

  console.log('load manager ');

  var module = {
    modes: arguments // store passed in modes
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
});
