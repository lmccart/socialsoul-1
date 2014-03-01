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
  var socket = io.connect('http://localhost'); // change this for deployment

  socket.emit('send', { message: 'hello from frontend' });

  socket.on('message', function (data) {
    console.log(data);
  });

  socket.on('trigger', function (data) {
  	console.log('trigger '+data.user);
    manager.reset();
    manager.init(data);
  });

  socket.on('assets', function (data) {
    console.log('assets '+data.dir);
    manager.addAssets(data);
  });

  socket.on('reconnect', function() {
    location.reload();
  });

  (function animloop(){
    requestAnimFrame(animloop);
    manager.update();
  })();


}