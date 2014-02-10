window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();



window.onload = function() {
  console.log('load');
  var manager = new Manager();
  var socket = io.connect('http://localhost');

  socket.emit('send', { message: 'hello from frontend' });

  socket.on('message', function (data) {
    console.log(data);
  });

  socket.on('trigger', function (data) {
  	console.log('trigger '+data.user);
    manager.reset();
    manager.init(data);
  });


  (function animloop(){
    requestAnimFrame(animloop);
    manager.update();
  })();


  // BA controller app
  $('#trigger').click(function(e){
    console.log('hi')
    window.location = './controller?action=trigger';
  });

}