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
    var goodVoices = [
      0, // us male
      1, // uk male
      2, // uk female
      10, // alex
      11, // agnes
      17, // bruce
      21, // fred
      25, // kathy
      28, // ralph
      30, // vicki
      31 // victoria
    ];
    msg.voice = speechSynthesis.getVoices()[randomChoice(goodVoices)];
    speechSynthesis.speak(msg);

    if (module.playing) {
      // module.timeoutID = setTimeout(module.playTweet, 8000);
    }
  };

  return module;
};