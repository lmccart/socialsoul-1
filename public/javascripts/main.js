// main just handles the routing of socket.io messages

window.onload = function() {

  var manager = new Manager();
  var host = window.location.host.indexOf('localhost') !== -1 ? 'http://localhost' : 'http://socialsoulserver.local';
  var socket = io.connect(host); 
  
  socket.emit('send', { message: 'hello from frontend' });

  socket.on('sync', function (data) {
    ServerTime.init(data.serverTime);
    console.log("synced with server (" + ServerTime.getTimeOffset() + " ms offset)");
    manager.sync();
  });

  // new user available
  socket.on('trigger', function (data) {
    manager.trigger(data);
  });

  // new media available
  socket.on('asset', function (data) {
    // convert from backend to frontend directory
    data.file = data.file.replace('./public', '..');
    manager.addAsset(data);
  });

  // mentor chosen
  socket.on('mentor', function (data) {
    // need to everything into a user object
    // console.log(data);
  });

  // refresh the page when node restarts
  socket.on('reconnect', function() {
    location.reload();
  });

  // animation loop for modes
  (function animloop(){
    requestAnimationFrame(animloop);
    manager.update();
  })();
}