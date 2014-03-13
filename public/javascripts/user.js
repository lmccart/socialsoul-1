// a User object has all the data we know about that user
// it's for storing info about the subject and the mentor

var User = function() {
	var module = {
		user: "",
		tweets: [],
		salient: [],

		profile: "",
		background: "",
		files: [],
		friends: []
	};

	module.loadData = function(data) {
		module.user = data.user;
	    module.salient = data.salient;
	    module.tweets = data.tweets;
		for(var i = 0; i < module.tweets.length; i++) {
			module.tweets[i].text = module.tweets[i].text.replace('&amp;', '&');
		}
	}

	var paletteCache = {};
	module.getPalette = function(img) {
		if(!paletteCache[img.src]) {
	        var sampleSize = 1000;
	        var stepSize = Math.floor(img.width * img.height / sampleSize);
	        stepSize = Math.min(stepSize, 1);
			paletteCache[img.src] = colorThief.getPalette(img, 4, stepSize);
		}
		return paletteCache[img.src];
	}
	return module;
}