var count, counter;

var syncState = {
	mentors: []
};

function recordEvent(html) {
	$("#events").prepend("<li>" + html + "</li>");
}


window.onload = function() {

  function displayDisconnect() {
    $('#error_status').html('');
    $('#user_status').html('');
    $('#time_status').html('<span class="error">Not connected to server.</span>');
    $('#users').empty();
  }

  // socket stuff

  var host = 'http://' + window.location.hostname + ':3030';
  window.socket = io.connect(host); 
  
  socket.emit('send', { message: 'hello from frontend: ' + window.location.toString() });
  socket.emit('controller', { action: 'update' });


  socket.on('trigger', function (data) {
    console.log(data);
    $('#error_status').html('');
    $('#user_status').html('Currently playing with '+data.user);
    $('#time_status').html('Time remaining: <span id="cur_time">'+Math.round(data.remaining/1000)+'</span>');
    startTimer(data.remaining/1000);
  });

  socket.on('disconnect', function(data) {
    displayDisconnect();
  });

  socket.on('error', function(data) {
    if (data.msg) {
      $('#error_status').html(data.msg);
      $('#user_status').html('');
      $('#time_status').html('');
    } else {
      displayDisconnect();
    }
  });

  // update controller
  socket.on('sync', function (data) {
    console.log(data);
	syncState = data;
    if (data.cur_user) {
      $('#user_status').html('Currently playing with '+data.cur_user);    
      $('#time_status').html('Time remaining: <span id="cur_time">'+Math.round(data.remaining/1000)+'</span>');
      startTimer(data.remaining/1000);
    } else {
      $('#user_status').html('');
      $('#time_status').html('<span class="highlight">Ready for next visitor!</span>');
    }

    switch(data.reason.code) {
      case 'added_mentor':
        recordEvent('Mentor <em>' + data.reason.data + '</em> added to database.')
        break;
      case 'removed_mentor':
        recordEvent('Mentor <em>' + data.reason.data + '</em> removed from database.')
        break;
      case 'rebuilt_db':
        recordEvent('People database has been rebuilt.')
        break;
      case 'updated_end_tweet_template':
        recordEvent('Successfuly updated end tweet template.')
        break;
	  case 'updated_hash_tag':
        recordEvent('Successfuly updated hash tag.')
	  	break;
	  case 'updated_exit_text':
        recordEvent('Successfuly updated exit text.')
	  	break;
	  case 'updated_twitter_creds':
        recordEvent('Successfuly updated twitter credentials.')
		break;
    }

    $('#error_status').html('');
    
    $('#users').empty();
    for (var i=data.users.length; i>0; i--) {
      var k = (i === data.users.length) ? 0 : i;
      var str = "<li><button id='"+data.users[k]+"' class='button trigger btn'>"+data.users[k]+"</button>";
      if (k !== 0) str += "<button id='"+data.users[k]+"' class='button remove btn'>x</button>";
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

    // try not to override user input
    if (!$('#end_tweet_template').is(':focus')) {
      $('#end_tweet_template').val(data.end_tweet_template || '');
    }

    if (!$('#hash_tag').is(':focus')) {
      $('#hash_tag').val(data.hash_tag || '');
    }

    if (!$('#exit_text').is(':focus')) {
      $('#exit_text').val(data.exit_text || '');
    }

    if (!$('#consumer_key').is(':focus')) {
      $('#consumer_key').val(data.twitter_creds.consumer_key || '');
    }

    if (!$('#consumer_secret').is(':focus')) {
      $('#consumer_secret').val(data.twitter_creds.consumer_secret || '');
    }

    if (!$('#access_token_key').is(':focus')) {
      $('#access_token_key').val(data.twitter_creds.access_token_key || '');
    }

    if (!$('#access_token_secret').is(':focus')) {
      $('#access_token_secret').val(data.twitter_creds.access_token_secret || '');
    }

    $('#restart').click(function(e){
      dialog(
        "#restart_dialog",
        function() {
          console.log('restart');
          socket.emit('controller', { action: 'restart' });
          displayDisconnect();
        },
        function() { /* NO-OP placeholder */ }
      );
    });

    if (data.mentors) {
      $("#mentor").autocomplete({
        source: data.mentors,
        select: function (e, ui) {
          $("#mentor_button").text("remove mentor");
        }
      });
    }

  });
  
  $(".dialog").dialog({
    autoOpen: false,
    modal: true
  });

  $('#queue_user').click(function(e){
    if ($('#user').val().length > 0) {
      socket.emit('controller', { action:'queue_user', user: $('#user').val() });
      $('#user').val('');
    }
  });

  // change on text entry
  $("#mentor").on("keypress", function (e) {
    $("#mentor_button").text('add mentor');
  });

  // change on backspace
  $("#mentor").on("keydown", function (e) {
    var code = e.which;
    if (
      code == 8 // bacskpace
        || code == 46 // delete
    ) {
      $("#mentor_button").text('add mentor');
    }
  });

  $("#mentor_button").click(function (e) {
    var action = $(this).text().split(' ')[0],
        user = $("#mentor").val().trim();
    if (!user) return;
    switch (action) {
      case 'add':
        socket.emit('controller', { action: 'add_mentor', user: user });
        $("#mentor_button").text('remove mentor');
        break;
      case 'remove':
        socket.emit('controller', { action: 'remove_mentor', user: user });
        $("#mentor_button").text('add mentor');
        break;
    }
  });

  $('#update_end_tweet_template').click(function (e) {
    var template = $("#end_tweet_template").val().trim();
    try {
      if (!/{{user}}/.test(template)) {
        return error('Template must contain the text <em>{{user}}</em> to indicate where the user\'s twitter handle should appear.');
      }

      if (!/{{mate}}/.test(template)) {
        return error('Template must contain the text <em>{{mate}}</em> to indicate where the soul mate\'s twitter handle should appear.');
      }

      socket.emit('controller', { action: 'update_end_tweet_template', template: template }, function (err, result) {
        if (err) {
          error('Failed to update end tweet template.');
        } else {
          $("#overlay").hide();
        }
      });

      function error(msg) {
        $("#update_end_tweet_template_result").html('<span>' + msg + '</span>');
        dialog("#update_end_tweet_template_result", function () { /* NO-OP placeholder */ });
      }
    } catch (err) {
      error('<span>Encountered unknown error updating end tweet template.</span>');
    }
  });

  $('#update_hash_tag').click(function (e) {
	  var tag = $("#hash_tag").val().trim();
	  socket.emit('controller', { action: 'update_hash_tag', hashTag: tag});
  });

  $('#update_exit_text').click(function (e) {
	  console.log('updating exit text');
	  var exitText = $("#exit_text").val().trim();
	  socket.emit('controller', { action: 'update_exit_text', exitText: exitText});
  });

  $("#upload_mentors").click(function (e) {
	  $("#upload_mentors_file").click();
  });

  $("#update_twitter_creds").click(function (e) {
	  socket.emit('controller', {
		  action: 'update_twitter_creds',
		  creds: {
			consumer_key: $("#consumer_key").val(),
			consumer_secret: $("#consumer_secret").val(),
			access_token_key: $("#access_token_key").val(),
			access_token_secret: $("#access_token_secret").val()
		  }
	  });
  });

  // build db
  var command = window.location.search.substring(1);
  if (command == 'build_db') {
    socket.emit('controller', {action: 'build_db'});
    setTimeout(function(){window.location = window.location.pathname;}, 1000);
  }  // test algo
  else if (command == 'test_algo') {
    socket.emit('controller', {action: 'test_algo'});
    setTimeout(function(){window.location = window.location.pathname;}, 1000);
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


function handleMentorsUpload(input) {
	var file = input.files[0];
	if (file) {
		input.value = ""; // clear the input so they can uploa again
		console.log('processing mentors upload ' + file.name);
		var reader = new FileReader();
		reader.onerror = function (err) { console.log(err); }
		reader.onload = function (e) {
			var newMentors = _.uniq(e.target.result.split("\n"));

			// remove redundant entries in newMentors
			// and remove existing members that are not in newMentors
			syncState.mentors.forEach(function (mentor) {
				var idx = newMentors.indexOf(mentor);
				if (idx != -1) {
					console.log('skipping already added mentor ' + mentor);
					newMentors.splice(idx, 1); // already added, so skip
				} else {
					// not in newMentors, so we should remove from the system
					console.log('removing mentor ' + mentor);
					socket.emit('controller', { action: 'remove_mentor', user: mentor});
				}
			});

			if (newMentors.length > 0) {
				// if we're actually doing something, then rebuild the DB, so we don't
				// have old people from previous uses
				socket.emit('controller', {action: 'build_db'});
			}

			// what remains in newMentors is what should be added
			newMentors.forEach(function (mentor) {
				mentor = mentor.trim();
				if (mentor) {
					console.log('adding mentor ' + mentor);
					socket.emit('controller', { action: 'add_mentor', user: mentor });
				}
			});

			recordEvent("Mentors uploaded.");
		}
		reader.readAsText(file);
	}
}

function dialog(selector, confirm, cancel) {
	var buttons = {};
	$("#overlay").show();
	buttons.confirm = wrap(confirm) || wrap(noop);
	if (cancel) buttons.cancel = wrap(cancel);
	$(selector).dialog({buttons: buttons});
	$(selector).dialog("open");

	function noop() {}
	function wrap(fn) {
		return function () {
			try { fn(); } finally {
			$(this).dialog("close");
			$("#overlay").hide();
			}
		};
	}
}


