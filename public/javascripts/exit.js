// main just handles the routing of socket.io messages

var showing_user = false;
setInterval(swapExit, 3000);

window.onload = function() {

  var host = window.location.host.indexOf('localhost') !== -1 ? 'http://localhost:3030' : 'http://socialsoulserver.local:3030';
  var socket = io.connect(host); 
  
  socket.emit('send', { message: 'hello from frontend' });

  socket.on('sync', function (data) {
    console.log(data);
  });

  // new user available
  socket.on('mentor', function (data) {
    console.log(data);
    $('#name').html('Your social soulmate is <br>'+data.name);
    $('#user').html('@'+data.user);
  });

}

function swapExit() {
  var cur = showing_user ? $('#exit_user') : $('#exit_name');
  var next = showing_user ? $('#exit_name') : $('#exit_user');

  showing_user = !showing_user;

  cur.fadeOut();
  next.fadeIn();
}