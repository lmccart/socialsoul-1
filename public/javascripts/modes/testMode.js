var TestMode = function() {

  console.log('load testmode ');

  var module = {};
  


  
  module.play = function() {
    console.log(module.content);
    //$('#test').html('welcome '+module.user);
    for (var i=0; i<module.content.length; i++) {
      console.log(module.content[i]);
      $('#test').append('<div class="tweet">'+module.content[i].text+'</div>');
    }
    //$('#test').textillate({loop: true, minDisplayTime: 1000});
    $('.tweet').textillate({minDisplayTime: 1000});

  };

  module.exit = function() {
    $('#test').empty();
  }
  
  return module;
};
