var ImageMode = function() {

  console.log('load imagemode ');

  var module = {};

  module.play = function() {
    console.log("play");
    $('#test').css('text-align','left');

    // for (var i=0; i<module.files.length; i++) {
    //   if (module.files[i].indexOf('.mp4') !== -1) { // append vine
    //     $('#test').append('<object data="'+module.dir+module.files[i]+'" >');
    //   } else { // append image
    //     $('#test').append('<img src="'+module.dir+module.files[i]+'" />');
    //   }
    // }
    // for (var i=0; i<module.tweets.length; i++) {
    //   console.log(module.tweets[i]);
    //   $('#test').append('<div class="tweet">'+module.tweets[i].text+'</div>');
    // }

    if (module.tweets) {
      var ind = Math.floor(module.tweets.length*Math.random());
      $('#test').html('<div class="tweet">'+module.tweets[ind].text+'</div>');
    }
  };

  module.next = function() {
    // var ind = module.files.length-1;
    var ind = Math.floor(module.files.length * Math.random());
    if (ind >= 0) {
      if (module.files[ind].indexOf('.mp4') !== -1) { // append vine
        $('#test').html('<object data="'+module.files[ind]+'" >');
      } else { // append image
        $('#test').html('<img src="'+module.files[ind]+'" />');
      }
    }
    var ind = Math.floor(module.tweets.length*Math.random());
    $('#test').append('<div class="tweet">'+module.tweets[ind].text+'</div>');
  };

  module.exit = function() {
    $('#test').empty();
  };
  
  return module;
};

