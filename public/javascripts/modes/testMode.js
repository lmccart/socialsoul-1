var TestMode = function() {

  console.log('load testmode ');

  var module = {};
  


  
  module.play = function() {
  	console.log(module.data)
    $('#test').html('welcome '+module.data);
    $('#test').textillate({loop: true, minDisplayTime: 200000});

  };

  module.exit = function() {
    $('#test').empty();
  }
  
  return module;
};
