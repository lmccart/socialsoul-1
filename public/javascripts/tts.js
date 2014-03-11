
var TTS = function() {

  var module = {
    tweets: [],
    voices: speechSynthesis.getVoices(),
    playing: false,
    timeoutID: null
  };

  module.init = function(tweets) {
    module.tweets = tweets;
    module.playing = true;
    module.playTweet();
  };

  module.stop = function() {
    module.playing = false;
    if(module.timeoutID) {
      clearTimeout(module.timeoutID);
    }
  }

  module.playTweet = function() {
    var t = Math.floor(Math.random()*module.tweets.length);
    var tweet = module.tweets[t].text;
    
    //console.log(tweet);

    var v = Math.floor(Math.random()*module.voices.length);

    var msg = new SpeechSynthesisUtterance(tweet);
    msg.voice = module.voices[v];
    speechSynthesis.speak(msg);

    if (module.playing) {
      module.timeoutID = setTimeout(module.playTweet, 8000);
    }
  };

  return module;
};