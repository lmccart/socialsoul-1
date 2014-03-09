// a User object has all the data we know about that user
// it's for storing info about the subject and the mentor

var User = function() {
	var module = {
		user: "",
		tweets: [],
		salient: [],

		profile: "",
		background: "",
		files: []
	};
	return module;
}