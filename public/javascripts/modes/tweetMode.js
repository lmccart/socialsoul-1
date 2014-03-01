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
    $('.tweet').textillate({minDisplayTime: 1000});

  };

  module.exit = function() {
    $('#test').empty();
  }
  
  return module;
};
