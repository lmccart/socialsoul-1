var count, counter;


window.onload = function() {

  startTimer(parseInt($('#status').html(), 10));

  $('#trigger').click(function(e){
    window.location = './controller?action=trigger';
    startTimer();
  });

  $('#set_user').click(function(e){
    window.location = './controller?action=set_user&user='+$('#user').val();
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
     $('#status').html("ready!");
     return;
  } else {
  	$('#status').html(count);
  }
}


