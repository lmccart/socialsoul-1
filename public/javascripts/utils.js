function randomChoice(list) {
  var randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

function rgb(c) {
  return "rgba(" + (0|c[0]) + "," + (0|c[1]) + "," + (0|c[2]) + ", 255)";
}

function randomPowerOfTwo() {
  return Math.pow(2, 1 + Math.floor(Math.random() * 8));
}

var colorThief = new ColorThief();

// show the screen number on startup
var screenId = window.location.pathname.split("/")[2];
document.write('<div class="debug" id="screenId">'+screenId+"</div>");

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
      func();
    })();
  }
  module.stop = function() {
    alive = false;
    clearTimeout(curTimeout);
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
  "Lato",
  "Arvo",
  "Playfair Display",
  "BenchNine",
  "Lora",
  "Bitter",
  "Kreon",
  "Crete Round",
  "Droid Serif",
  "Oswald",
  "Open Sans Condensed",
  "Montserrat",
  "Raleway",
  "Roboto+Slab",
  "Inconsolata",
  "Signika",
  "Old Standard TT"
];
