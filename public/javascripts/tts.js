
var TTS = function() {

  var module = {
    tweets: [],
    voices: speechSynthesis.getVoices()
  };



  module.init = function(tweets) {
    module.tweets = tweets;
    module.playTweet();
  };


  module.playTweet = function() {
    var t = Math.floor(Math.random()*module.tweets.length);
    var tweet = module.tweets[t].text;
    //console.log(tweet);

    var v = Math.floor(Math.random()*module.voices.length);

    var msg = new SpeechSynthesisUtterance(tweet);
    msg.voice = module.voices[v];
    speechSynthesis.speak(msg);

    setTimeout(module.playTweet, 5000);
  };

  return module;
};