var DebugMode = function() {

  var module = {};

  module.play = function() {
    if (module.tweets) {
      var tweetText = "";
      console.log(module.tweets);
      for(var i = 0; i < module.tweets.length; i++) {
        tweetText += module.tweets[i].text;
      }
      $('#debug').html('<div class="tweet">'+tweetText+'</div>');
    }
  };

  module.next = function() {
    var ind = module.files.length-1;
    if (ind >= 0) {
      if (module.files[ind].indexOf('.mp4') !== -1) { // append vine
        $('#debug').append('<object data="'+module.files[ind]+'" />');
      } else { // append image
        $('#debug').append('<img src="'+module.files[ind]+'" />');
      }
    }
  };

  module.exit = function() {
    $('#debug').empty();
  };

  return module;
};

var EnterMode = function() {
  var module = {};
  module.play = function() {

  }
  module.next = function() {

  }
  module.exit = function() {

  }
  return module;
};

var ExitMode = function() {
  var module = {};
  module.play = function() {

  }
  module.next = function() {

  }
  module.exit = function() {

  }
  return module;
};

var TweetMode = function() {

  console.log('load testmode ');

  var module = {};
  
  
  module.play = function() {
    console.log(module.tweets);
    //$('#test').html('welcome '+module.user);
    for (var i=0; i<module.tweets.length; i++) {
      console.log(module.tweets[i]);
      $('#test').append('<div class="tweet">'+module.tweets[i].text+'</div>');
    }
    //$('#test').textillate({loop: true, minDisplayTime: 1000});
    //$('.tweet').textillate({minDisplayTime: 1000});

  };

  module.exit = function() {
    $('#test').empty();
  }
  
  return module;
};

var WelcomeMode = function() {

  console.log('load welcomemode ');

  var module = {};

  module.play = function() {
    console.log(module.tweets);
    $('#test').html(module.user);
  };

  module.exit = function() {
    $('#test').empty();
  }
  
  return module;
};

