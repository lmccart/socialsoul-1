// main just handles the routing of socket.io messages
window.SOCIAL_SOUL = true;

var showing_user = false;
var playlistDuration = getPlaylistDuration();
setInterval(swapExit, 3000);

window.onload = function() {

  var host = 'http://' + window.location.hostname + ':3030';
  window.socket = io.connect(host); 
  
  socket.emit('send', { message: 'hello from frontend: ' + window.location.toString() });

  socket.on('sync', function (data) {
    console.log(data);
	$('#subtitle').html(data.exit_text || '');
  });

  // new user available
  socket.on('mentor', function (data) {
    console.log(data);
    setTimeout(function() {
      $('#name').html('Your social soulmate is <br>'+data.name);
      $('#user').html('@'+data.user);    
    }, 1000 * playlistDuration / 2);
  });

}

function swapExit() {
  var cur = showing_user ? $('#exit_user') : $('#exit_name');
  var next = showing_user ? $('#exit_name') : $('#exit_user');

  showing_user = !showing_user;

  cur.fadeOut();
  next.fadeIn();
}
