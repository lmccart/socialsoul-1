var DebugMode = function() {
  var module = {};
  module.init = function(user) {
    var tweetText = "";
    for(var i = 0; i < user.tweets.length; i++) {
      tweetText += '<div class="tweet">' + user.tweets[i].text + '</div>';
    }
    $('body').append('<div class="debug" id="info">'+screenId+':'+user.user+'</div>');
    $('body').append('<img class="debug" id="profile"/>')
    $('body').append('<div class="debug">'+tweetText+'</div>');
    $('body').append('<div class="debug" id="files"></div>');
  }
  module.next = function(user) {
    if(user.profile) {
      document.getElementById('profile').src = user.profile; 
    }
    // rebuild all files
    $('#files').empty();
    for(var i = 0; i < user.files.length; i++) {
      if (user.files[i].indexOf('.mp4') !== -1) { // append vine
        $('#files').append('<object data="'+user.files[i]+'" />');
      } else { // append image
        $('#files').append('<img src="'+user.files[i]+'" />');
      }
    }
  }
  module.exit = function() {}
  return module;
};

// the entrance is pulsing white to black on the centermost two screens
// everything else is black
var EnterMode = function() {
  var module = {};
  var timeline = {};
  module.init = function() {
    // the browser can barely handle this at 60fps, maybe should be webgl
    if(screenId == 0) {
      $('body').append('<div class="fullscreen whitebg" id="color"></div>');
      timeline = new TimelineMax();
      timeline
        .set("#color", {opacity:1})
        .to("#color", 3, {opacity:0, ease:Power2.easeIn})
        .repeat(-1);
    } else {
      $('body').append('<div class="fullscreen blackbg" id="color"></div>');
    }
  }
  module.next = function() {}
  module.exit = function() {}
  return module;
};

// one scene involves flashing single words briefly in the center
// with the font randomly selected, and mosaic images in the background
var CenteredTextMode = function() {
  var module = {};
  var salientWords = [];
  var ctx = {};
  module.init = function(user) {
    $('body').append('<canvas id="centeredTextCanvas"></canvas>');
    $('body').append('<div class="centeredText"><span id="centeredWord"></span></div>');

    // replace this with backend salient words
    if (user.tweets) {
      for(i in user.tweets) {
        var tokens = user.tweets[i].text.split(' ');
        for(j in tokens) {
          if(tokens[j].length > 4 && tokens[j].length < 12)
          salientWords.push(tokens[j]);
        }
      }
    }

    var canvas = document.getElementById('centeredTextCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
  }
  module.next = function() {}
  module.exit = function() {}
  module.update = function(user) {
    if(user.files.length > 0) { 
      var img = new Image();
      img.src = randomChoice(user.files);
      img.onload = function() {
        var width = img.width;
        var height = img.height;
        var fullscreen = Math.random() < .2;
        var scale;
        if(fullscreen) {
          var widthScale = window.innerWidth / width;
          var heightScale = window.innerHeight / height;
          scale = Math.max(widthScale, heightScale);
        } else {
          var pixelCount = randomPowerOfTwo();
          scale = window.innerWidth / pixelCount;
        }
        ctx.drawImage(img, 0, 0, scale * width, scale * height);

        var clusters = colorThief.getPalette(img, 4, 1000);
        clusters = _.shuffle(clusters);
        $('#centeredWord').text(randomChoice(salientWords));
        $('#centeredWord').css({
          fontFamily: randomChoice(fonts),
          backgroundColor: rgb(clusters[0]),
          color: rgb(clusters[1])
        });
      }
    }
  }
  return module;
};

// the break should be quick pulsing of the whole space
// ideally in sync, or starting out of sync and coming into sync
var BreakMode = function() {
  var module = {};
  var timeline = {};
  module.init = function() {
    $('body').append('<div class="fullscreen whitebg" id="color"></div>');
    timeline = new TimelineMax();
    timeline
      .set("#color", {opacity:1})
      .to("#color", .5, {opacity:0, ease:Power2.easeIn})
      .repeat(-1);
  }
  module.next = function() {},
  module.exit = function() {}
  return module;
};

// exit is just white on all screens
var ExitMode = function() {
  var module = {};
  module.init = function() {
      $('body').append('<div class="fullscreen whitebg"></div>');
    },
  module.next = function() {}
  module.exit = function() {}
  return module;
};

