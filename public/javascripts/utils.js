// library objects
var colorThief = new ColorThief();

// helper functions
function randomChoice(list) {
  var randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

function rgb(c) {
  return "rgba(" + (0|c[0]) + "," + (0|c[1]) + "," + (0|c[2]) + ", 255)";
}

function randomPowerOfTwo(minPower, maxPower) {
  return Math.pow(2, minPower + Math.floor(Math.random() * (maxPower - minPower)));
}

// helper classes
var VariableTimeout = function() {
  var module = {
    timeoutLength: 0
  };
  var alive = false;
  var curTimeout;
  module.start = function(func, timeoutLength) {
    if(alive) {
      return;
    }
    alive = true;
    if(timeoutLength) {
      module.timeoutLength = timeoutLength;
    }
    (function loop() {
      if(alive) {
        curTimeout = setTimeout(loop, module.timeoutLength);
      }
      requestAnimationFrame(func);
    })();
  }
  module.stop = function() {
    alive = false;
    if(curTimeout) {
      clearTimeout(curTimeout);
    }
  }
  return module;
};

// singleton class
var ServerTime = (function() {
  var timeOffset = 0;
  return {
    init: function(serverTime) {
      this.timeOffset = serverTime - Date.now();
    },
    now: function() {
      return new Date(Date.now() + timeOffset);
    },
    getTimeOffset: function() {
      return timeOffset;
    }
  }
}());

var fonts = [
  // google open fonts
  "Arvo",
  "BenchNine-Light",
  "Bitter",
  "Droid Serif",
  "Inconsolata",
  "Kreon-Light",
  "Lato-Light",
  "Lora",
  "Montserrat",
  "OpenSans-CondensedLight",
  "Oswald-Light",
  "Playfair Display",
  "RobotoSlab-Light",
  "Signika-Light",

  // built in fonts
  "AppleGothic",
  "AppleSDGothicNeo-Thin",
  "Letter Gothic Std"
];
