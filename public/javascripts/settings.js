settings = {
	playlist: [
		// {mode:'debug',duration:0,user:'subject'}
		{
			mode: 'enter',
			duration: 20,
			user: 'subject'
		},
		{
			mode: 'tweet',
			duration: 20,
			user: 'subject',
			callback: function() {
				sounds.swipe.play();
				sounds.drone.stop();
				sounds.drone.fadeIn(1, 500);
			}
		},
		{
			mode: 'allImages',
			duration: 20,
			user: 'subject',
			callback: function() {
				sounds.texture0.fadeIn(1, 500);
			}
		},
		{
			mode: 'centeredText',
			duration: 20,
			user: 'subject',
			callback: function() {
			}
		},
		{
			mode: 'bridge',
			duration: 10,
			user: 'mentor',
			callback: function() {
				sounds.drone.fadeOut(0, 5000);
			}
		},
		{
			mode: 'centeredText',
			duration: 20,
			user: 'mentor',
			callback: function() {
				sounds.texture0.fadeOut(0, 5000);
				sounds.texture1.stop();
				sounds.texture1.fadeIn(1, 500);
			}
		},
		{
			mode: 'allImages',
			duration: 20,
			user: 'mentor',
			callback: function() {
				sounds.texture2.stop();
				sounds.texture2.fadeIn(1, 500);
			}
		},
		{
			mode: 'tweet',
			duration: 20,
			user: 'mentor',
			callback: function() {
				sounds.texture3.stop();
				sounds.texture3.fadeIn(1, 500);
			}
		},
		{
			mode: 'exit',
			duration: 10,
			user: 'mentor',
			callback: function() {
				sounds.texture0.fadeOut(0, 30);
				sounds.texture1.fadeOut(0, 30);
				sounds.texture2.fadeOut(0, 30);
				sounds.texture3.fadeOut(0, 30);
			}
		}
	]
};