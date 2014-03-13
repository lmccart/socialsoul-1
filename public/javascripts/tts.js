var TTS = function() {

  var module = {
    tweets: [],
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
    var tweet = randomChoice(module.tweets).text;
    
    // console.log(tweet);

    var msg = new SpeechSynthesisUtterance(tweet);
    msg.voice = randomChoice(speechSynthesis.getVoices());
    speechSynthesis.speak(msg);

    if (module.playing) {
      module.timeoutID = setTimeout(module.playTweet, 8000);
    }
  };

  return module;
};