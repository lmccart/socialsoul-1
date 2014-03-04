var count, counter;


window.onload = function() {

  startTimer(parseInt($('#cur_time').html(), 10));

  if ($('#cur_user').html() == 'undefined' || $('#error_status').html() !== undefined) {
    $('#user_status').html('');
  } 

  $('.trigger').click(function(e){
    window.location = './controller?action=trigger&user='+e.target.id;
    startTimer();
  });

  $('#queue_user').click(function(e){
    if ($('#user').val().length > 0) {
      window.location = './controller?action=queue_user&user='+$('#user').val();
    }
  });
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
  	$('#cur_time').html(count);
  }
}


