$(window).ready(function() {


  var count, counter;
  $('#overlay').hide();
  $('#enter').hide();

  var host = 'http://' + window.location.hostname + ':3030';
  window.socket = io.connect(host); 
  
  socket.emit('send', { message: 'hello from frontend: ' + window.location.toString() });
  socket.emit('controller', { action: 'update' });

  socket.on('user_approved', function (data) {
    displayEnter();
    socket.emit('controller', { action:'trigger', user:data.user });
  });

  socket.on('trigger', function (data) {
    displayEnter();
  });

  socket.on('disconnect', function(data) {
    displayError();
  });

  socket.on('error', function(data) {
    if (data.type === 'twitter') displayTwitterError(data.msg);
    else displayError(data.msg);
  });

  // update controller
  socket.on('sync', function (data) {
    console.log(data);
    if (data.cur_user && data.remaining) {
      startTimer(data.remaining/1000);
      displayCountdown(data.remaining/1000);
    } else {
      $('#user_status').html('');
      $('#overlay').hide();
    }

    $('#submit').click(function() {
      $('#buttons').hide();
      var user = $('#user').val();
      user = user.replace(/\s/g, ''); // strip white space
      user = user.replace('@', ''); // strip @ symbol
      socket.emit('controller', { action:'test_user', user:user });
    });


    $('#RANDOMIZE').click(function(e) {
      $('#buttons').hide();
      displayEnter();
      socket.emit('controller', { action:'trigger', user:e.target.id });
    });


  });


  function startTimer(val) {
    clearInterval(counter);
    count = Math.round(val);
    counter = setInterval(timer, 1000);
  }

  function timer() {
    count--;
    if (count <= 0) {
      clearInterval(counter);
      //counter ended, do something here
      $('#user_status').html('');
      $('#overlay').hide();
      $('#buttons').show();
      return;
    } else {
      $('#time_status').html(Math.round(count));
    }
  }

  function displayEnter() {
    $('#enter').show(0).delay(1000).hide(0);
    setTimeout(displayCountdown, 3000);
  }
  
  function displayCountdown(remaining) {
    $('#error_status').html('');
    $('#time_status').html(count);
    $('#overlay').show();
  }

  function displayTwitterError(msg) {
    $('#buttons').show();
    $('#error_status').html(msg);
  }

  function displayError(msg) {
    // var error = 'ERROR';
    // if (msg) error += ' '+msg;
    // $('#time_status').html(error);
    // $('#overlay').show();
  }


});