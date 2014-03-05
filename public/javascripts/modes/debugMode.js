var DebugMode = function() {

  var module = {};

  module.play = function() {
    if (module.tweets) {
      var tweetText = "";
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
        $('#debug').append('<object data="'+module.files[ind]+'" >');
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

