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
		soundtrack: function() {
			sounds.mix.play();
		},
		callback: function() {
			TTS.stop();
		}
	},
	{
		mode: 'tweet',
		duration: 12,
		user: 'subject',
		soundtrack: function() { },
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
		soundtrack: function() { },
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
		soundtrack: function() { },
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
		soundtrack: function() { },
		callback: function() {
			TTS.stop();
		}
	},
	{
		mode: 'centeredText',
		duration: 8,
		user: 'mentor',
		soundtrack: function() { },
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
		soundtrack: function() { }
	},
	{
		mode: 'tweet',
		duration: 4,
		user: 'mentor',
		soundtrack: function() { },
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
		soundtrack: function() { },
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
