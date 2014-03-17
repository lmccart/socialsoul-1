function getPlaylistDuration() {
	var duration = 0;
	for(var i = 0; i < playlist.length; i++) {
		duration += playlist[i].duration;
	}
	return duration;
}

var playlist = [
	// {mode:'debug',duration:0,user:'subject'}
	{
		mode: 'enter',
		duration: 16,
		user: 'subject',
		callback: function() {
			TTS.stop();
		}
	},
	{
		mode: 'tweet',
		duration: 12,
		user: 'subject',
		soundtrack: function() {
			sounds.drone.stop();
			sounds.silenceglitch.stop();	
			sounds.texture0.stop();
			sounds.texture1.stop();
			sounds.texture2.stop();
			sounds.texture3.stop();

			sounds.swipe.play();
			sounds.drone.fadeIn(1, 500);
		},
		callback: function() {
			if(screenId == 2) {
				TTS.init(users.subject.tweets);
			}
		}
	},
	{
		mode: 'allImages',
		duration: 16,
		user: 'subject',
		soundtrack: function() {
			sounds.silenceglitch.fadeIn(1, 100);
		},
		callback: function() {
			if(screenId == 4) {
				TTS.init(users.subject.tweets);
			}
		}
	},
	{
		mode: 'centeredText',
		duration: 16,
		user: 'subject',
		soundtrack: function() {
			sounds.texture0.fadeIn(1, 500);
		},
		callback: function() {
			if(screenId == 6 || screenId == 8) {
				TTS.init(users.subject.tweets);
			}
		}
	},
	{
		mode: 'bridge',
		duration: 8,
		user: 'mentor',
		soundtrack: function() {
			sounds.drone.fadeOut(0, 5000);
			sounds.silenceglitch.fadeOut(0, 2000);
		},
		callback: function() {
			TTS.stop();
		}
	},
	{
		mode: 'centeredText',
		duration: 8,
		user: 'mentor',
		soundtrack: function() {
			sounds.texture0.fadeOut(0, 1000);
			sounds.texture1.fadeIn(1, 30);
			sounds.drone.fadeIn(1, 500);
		},
		callback: function() {
			if(screenId == 2 || screenId == 4 || screenId == 6 || screenId == 8) {
				TTS.init(users.mentor.tweets);
			}
		}
	},
	{
		mode: 'allImages',
		duration: 8,
		user: 'mentor',
		soundtrack: function() {
			sounds.texture2.fadeIn(1, 500);
		}
	},
	{
		mode: 'tweet',
		duration: 4,
		user: 'mentor',
		soundtrack: function() {
			sounds.texture3.fadeIn(1, 500);
		},
		callback: function() {
			if(screenId == 4 || screenId == 8) {
				TTS.stop();
			}
		}
	},
	{
		mode: 'exit',
		duration: 6,
		user: 'mentor',
		soundtrack: function() {
			sounds.texture0.fadeOut(0, 30);
			sounds.texture1.fadeOut(0, 30);
			sounds.texture2.fadeOut(0, 30);
			sounds.texture3.fadeOut(0, 30);
			sounds.beep433.fadeOut(0, 30);
			sounds.drone.fadeOut(0, 30);
		},
		callback: function() {
			TTS.stop(); // stop 2 and 6
		}
	}
];

try {
	module.exports = {
		getPlaylistDuration: getPlaylistDuration
	}
} catch (err) {

}