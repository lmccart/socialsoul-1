$(window).ready(function() {


  var count, counter;
  $('#overlay').hide();
  $('#enter').hide();

  $('input').bind('keypress', function(e) {
    if(e.which === 13) {
      document.activeElement.blur();
    }
  });

  function isTextInput(node) {
    return ['INPUT', 'TEXTAREA'].indexOf(node.nodeName) !== -1;
  }

  function isButton(node) {
    return ['BUTTON'].indexOf(node.nodeName) !== -1;
  }

  document.addEventListener('touchend', function(e) {
    if (!isTextInput(e.target) && !isButton(e.target) && isTextInput(document.activeElement)) {
      $('input').blur();
    }
  }, false);

  var host = 'http://' + window.location.hostname + ':3030';
  window.socket = io.connect(host); 
  
  socket.emit('send', { message: 'hello from frontend: ' + window.location.toString() });
  socket.emit('controller', { action: 'update' });

  socket.on('user_approved', function (data) {
    console.log('approved')
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
    console.log('sync '+data.cur_user);
    if (data.cur_user && data.remaining) {
      startTimer(data.remaining/1000);
      displayCountdown(data.remaining/1000);
    } else {
      $('#user_status').html('');
      $('#overlay').hide();
      $('#buttons').show();
      $('#user').html('@');
    }

  });

  $('#submit').click(function() {
    var user = $('#user').val();
    user = user.replace('@', ''); // strip @ symbol
    if (user.length > 0) {
      $('#buttons').hide();
      user = user.replace(/\s/g, ''); // strip white space
      socket.emit('controller', { action:'test_user', user:user });
    }
  });


  $('#RANDOMIZE').click(function(e) {
    displayEnter();
    socket.emit('controller', { action:'trigger', user:e.target.id });
  });

  $('#error_status').click(function() {
    location.reload();
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
      $('#time_status').html(Math.round(count)).show();
      $('#error_status').hide();
    }
  }

  function displayEnter() {
    $('#enter').show(0).delay(4000).hide(0);
    $('#buttons').show();
    $('#user').val('@');
  }
  
  function displayCountdown(remaining) {
    $('#error').html('');
    $('#error_status').hide();
    $('#time_status').html(count).show();
    $('#overlay').show();
  }

  function displayTwitterError(msg) {
    $('#buttons').show();
    $('#error').html(msg);
  }

  function displayError(msg) {
    clearInterval(counter);
    var error = 'ERROR';
    if (msg) error += ' '+msg;
    $('#error_status').html('SORRY, PLEASE TRY AGAIN LATER<br><span style="font-size:6vmin;">(TAP TO REFRESH)</span>').show();
    $('#time_status').hide();
    $('#overlay').show();
  }


});