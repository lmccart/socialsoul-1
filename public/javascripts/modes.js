var DebugMode = function() {

  var module = {};

  module.init = function() {
    if (module.tweets) {
      var tweets = "";
      console.log(module.tweets);
      for(var i = 0; i < module.tweets.length; i++) {
        tweets += '<div class="tweet">' + module.tweets[i].text + '</div>';
      }
      $('body').append('<div class="debug" id="info">'+screenId+':'+module.user+'</div>');
      $('body').append('<div class="debug">'+tweets+'</div>');
      $('body').append('<div class="debug" id="media"></div>');
    }
  };

  module.next = function() {
    var ind = module.files.length-1;
    if (ind >= 0) {
      if (module.files[ind].indexOf('.mp4') !== -1) { // append vine
        $('#media').append('<object data="'+module.files[ind]+'" />');
      } else { // append image
        $('#media').append('<img src="'+module.files[ind]+'" />');
      }
    }
  };

  module.exit = function() {
  };

  return module;
};

var EnterMode = function() {
  var module = {};
  module.init = function() {
    if(screenId == 0) {
      $('body').html('<div class="fullscreen whitebg" id="color"></div>');
    } else {
      $('body').html('<div class="fullscreen blackbg" id="color"></div>');
    }

    var timeline = new TimelineMax();
    timeline
      .set("#color", {opacity:1})
      .to("#color", 3, {opacity:0, ease:Power2.easeIn})
      .repeat(-1);
  }
  module.next = function() {

  }
  module.exit = function() {

  }
  return module;
};

var ExitMode = function() {
  var module = {};
  module.init = function() {
    $('body').html('<div class="fullscreen whitebg"></div>');
  }
  module.next = function() {

  }
  module.exit = function() {

  }
  return module;
};

