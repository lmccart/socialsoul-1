window.onload = function() {
  console.log('load');
  var messages = [];
  var socket = io.connect('http://localhost');

  socket.emit('send', { message: 'hello from frontend' });

  socket.on('message', function (data) {
    console.log(data);
  });
 
}