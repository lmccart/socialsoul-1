function once(func) {
    var run = false;
    return function() {
        if(!run) {
            run = true;
            func();
        }
    }
}

var Speech = (function() {
  var voices;
  var speaking = false;
  return {
    speak: function(settings) {
      if(settings.text == undefined) {
        return;
      }
      // bug: sometimes speechSynthesis gets stuck speaking
      // if you call cancel(), you can restart it
      if(speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      var msg = new SpeechSynthesisUtterance(settings.text);
      msg.onstart = function() {
        console.log('onstart');
        if(settings.onstart) {
          settings.onstart();
        }
      }
      var endOnce = once(function() {
        console.log('onend');
        if(settings.onend) {
          // bug: if you try to talk right after speaking,
          // the tts engine isn't ready yet. timeout fixes it.
          setTimeout(settings.onend, 0);
        }
      });
      msg.onend = endOnce;
      var speakOnce = once(function() {
        console.log('speak');
        // wait to assign the voice until it's ready
        if(settings.voice != undefined) {
          msg.voice = voices[settings.voice];
        }
        speechSynthesis.speak(msg);
      });
      // bug: if you try to talk before onvoiceschanged
      // the tts engine can crash
      speechSynthesis.onvoiceschanged = function() {
        console.log('onvoiceschanged');
        voices = speechSynthesis.getVoices();
        setTimeout(speakOnce, 0);
      }
      if(voices) {
        speakOnce();
      }
      // bug: tts engine doesn't always report that it has ended
      // this puts a max time of 10s on any tts
      var maxLength = settings.maxLength || 10000;
      setTimeout(function() {
        endOnce();
      }, maxLength);
    },
    cancel: function() {
      speechSynthesis.cancel();
    }
  }
})();

var TTS = function() {

  var module = {
    tweets: [],
    playing: false
  };

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

  module.init = function(tweets) {
    module.tweets = tweets;
    module.playing = true;
    module.playTweet();
  };

  module.playTweet = function() {
    if(module.playing) {
      var tweet = randomChoice(module.tweets).text
        .replace(/RT/g, ' retweet ')
        .replace(/#/g, ' hashtag ')
        .replace(/@/g, '');
      console.info("playTweet: " + tweet);
      Speech.speak({
        text: tweet,
        voice: randomChoice(goodVoices),
        onend: module.playTweet
      });
    }
  };

  module.stop = function() {
    module.playing = false;
    Speech.cancel();
  }

  return module;
};