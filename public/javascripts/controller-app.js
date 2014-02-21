var count, counter;


window.onload = function() {

  startTimer(parseInt($('#cur_time').html(), 10));

  if ($('#cur_user').html() == 'null') {
    $('#user_status').html('');
  } 

  $('.trigger').click(function(e){
    console.log('hi '+e.target.id);
    window.location = './controller?action=trigger&user='+e.target.id;
    startTimer();
  });

  $('#queue_user').click(function(e){
    window.location = './controller?action=queue_user&user='+$('#user').val();
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
     $('#time_status').html("Ready for next visitor!");
     return;
  } else {
  	$('#cur_time').html(count);
  }
}


