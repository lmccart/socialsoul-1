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

var screenId = window.location.pathname.split("/")[2];

// show the screen number on startup
document.write('<div class="debug" id="screenId">'+screenId+"</div>");
