// main just handles the routing of socket.io messages

window.onload = function() {

  var host = window.location.host.indexOf('localhost') !== -1 ? 'http://localhost:3030' : 'http://socialsoulserver.local:3030';
  var socket = io.connect(host); 
  
  socket.emit('send', { message: 'hello from frontend' });

  socket.on('sync', function (data) {
  });

  // new user available
  socket.on('mentor', function (data) {
    $('#handle').html('Your social soulmate is @'+data.user+'.');
  });

}