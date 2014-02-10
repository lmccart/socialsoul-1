

//window.onload = function() {


require.config({
  // The shim config allows us to configure dependencies for
  // scripts that do not call define() to register a module
  shim: {
    'socketio': {
      exports: 'io'
    }
  },
  paths: {
    jquery: 'libs/jquery-1.11.0',
    socketio: '../socket.io/socket.io'
  }
});

define([
  'socketio',
  'manager'
],

function(io, manager) {

  var socket = io.connect('http://localhost');

  socket.emit('send', { message: 'hello from frontend' });

  socket.on('message', function (data) {
    console.log(data);
    manager.init(data);
  });

});

//}