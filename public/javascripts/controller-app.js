var count, counter;


window.onload = function() {

  // socket stuff

  var host = window.location.host.indexOf('localhost') !== -1 ? 'http://localhost:3030' : 'http://socialsoulserver.local:3030';
  var socket = io.connect(host); 
  
  socket.emit('send', { message: 'hello from frontend' });
  socket.emit('controller', { action: 'update' });


  socket.on('trigger', function (data) {
    console.log(data);
    $('#error_status').html('');
    $('#user_status').html('Currently playing with '+data.user);
    $('#time_status').html('Time remaining: <span id="cur_time">'+Math.round(data.remaining/1000)+'</span>');
    startTimer(data.remaining/1000);
  });

  socket.on('disconnect', function(data) {
    $('#user_status').html('');
    $('#time_status').html('<span class="highlight">Not connected to server.</span>');
  });

  socket.on('error', function(data) {
    $('#error_status').html(data.msg);
    $('#user_status').html('');
  });

  // update controller
  socket.on('sync', function (data) {
    console.log(data);
    if (data.cur_user) {
      $('#user_status').html('Currently playing with '+data.cur_user);    
      $('#time_status').html('Time remaining: <span id="cur_time">'+Math.round(data.remaining/1000)+'</span>');
      startTimer(data.remaining/1000);
    } else {
      $('#user_status').html('');
      $('#time_status').html('<span class="highlight">Ready for next visitor!</span>');
    }
    
    $('#users').empty();
    for (var i=data.users.length; i>0; i--) {
      var k = (i === data.users.length) ? 0 : i;
      var str = "<li><span id='"+data.users[k]+"' class='button trigger'>"+data.users[k]+"</span>";
      if (k !== 0) str += "<span id='"+data.users[k]+"' class='button remove'>x</span>";
      str += "</li>";
      $('#users').append(str);
    }

    $('.trigger').click(function(e){
      socket.emit('controller', { action:'trigger', user:e.target.id });
      startTimer();
    });

    $('.remove').click(function(e){
      socket.emit('controller', { action:'remove', user:e.target.id });
    });

  });


  $('#queue_user').click(function(e){
    console.log('hi')
    if ($('#user').val().length > 0) {
      socket.emit('controller', { action:'queue_user', user: $('#user').val() });
      $('#user').val('');
    }
  });



  // build db
  var command = window.location.search.substring(1);
  if (command == 'build_db') {
    socket.emit('controller', {action: 'build_db'});
    // redirect
    setTimeout(function(){window.location = 'http://localhost:3000/controller.html';}, 1000);
  }

}

function startTimer(val) {
	clearInterval(counter);
	count = val;
	counter = setInterval(timer, 1000);
}

function timer() {
  count--;
  if (count <= 0) {
     clearInterval(counter);
     //counter ended, do something here
     $('#user_status').html('');
     $('#time_status').html("Ready for next visitor!");
     return;
  } else {
  	$('#cur_time').html(Math.round(count));
  }
}


