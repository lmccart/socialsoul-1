var TTS = function() {

  var module = {
    tweets: [],
    playing: false,
    timeoutID: null
  };

  var voicesReady = false;

  module.init = function(tweets) {
    module.tweets = tweets;
    module.playing = true;
    speechSynthesis.onvoiceschanged = function() {
      console.info("voices changed");
      voicesReady = true;
    }
    speechSynthesis.getVoices();
    module.playTweet();
  };

  function speak(text) {
    if(!voicesReady) {
      console.log("voices not ready, waiting 500ms");
      setTimeout(function() {speak(text)}, 500);
      return;
    }
    var msg = new SpeechSynthesisUtterance(text);
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
    if(speechSynthesis.speaking) {
      console.info('already speaking, cancelling');
      speechSynthesis.cancel();
    }
    console.info('calling speechSynthesis.speak');
    speechSynthesis.speak(msg);
  }

  module.playTweet = function() {
    var tweet = randomChoice(module.tweets).text;
    console.info("playTweet: " + tweet);
    speak(tweet);
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