$(window).ready(function() {


  var count, counter;
  $('#overlay').hide();
  $('#enter').hide();

  var host = 'http://' + window.location.hostname + ':3030';
  window.socket = io.connect(host); 
  
  socket.emit('send', { message: 'hello from frontend: ' + window.location.toString() });
  socket.emit('controller', { action: 'update' });

  socket.on('trigger', function (data) {
    displayEnter(data.remaining/1000);
  });

  socket.on('disconnect', function(data) {
    displayError();
  });

  socket.on('error', function(data) {
    displayError();
  });

  // update controller
  socket.on('sync', function (data) {
    console.log(data);
    if (data.cur_user && data.remaining) {
      displayCountdown(data.remaining/1000);
    } else {
      $('#user_status').html('');
      $('#overlay').hide();
    }

    $('#submit').click(function() {

    });


    $('#RANDOMIZE').click(function(e) {
      socket.emit('controller', { action:'trigger', user:e.target.id });
    });


  });


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
       $('#overlay').hide();
       return;
    } else {
      $('#time_status').html(Math.round(count));
    }
  }
  
  function displayCountdown(remaining) {
    $('#enter').hide();
    if (!count) startTimer(remaining);
    $('#error_status').html('');
    $('#time_status').html(Math.round(remaining));
    $('#overlay').show();
  }

  function displayError() {
    $('#time_status').html('ERROR');
    $('#overlay').show();
  }

  function displayEnter(remaining) {
    startTimer(remaining);
    $('#enter').show();
    setTimeout(displayCountdown, 3000);
  }

});