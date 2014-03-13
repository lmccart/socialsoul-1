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

  module.playTweet = function() {
    var tweet = randomChoice(module.tweets).text;
    console.info("playTweet: " + tweet);

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
    var voiceChoice = randomChoice(goodVoices);
    console.info("voiceChoice: " + voiceChoice);
    msg.voice = speechSynthesis.getVoices()[voiceChoice];
    msg.onerror = function(event) {
      console.error("speech synthesis error");
      console.error(event)
    };
    msg.onstart = function(event) {
      console.info("speech synthesis start");
      console.info(event)
    };
    msg.onend = function(event) {
      console.info("speech synthesis end");
      console.info(event)
    };
    console.info('calling speechSynthesis.speak');
    speechSynthesis.speak(msg);

    if (module.playing) {
      // module.timeoutID = setTimeout(module.playTweet, 8000);
    }
  };

  module.stop = function() {
    module.playing = false;
    if(module.timeoutID) {
      clearTimeout(module.timeoutID);
    }
  }

  return module;
};