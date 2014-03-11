
var TTS = function() {

  var module = {
    tweets: []
  };


  module.init = function(tweets) {
    module.tweets = tweets;
    module.playTweet();
  };


  module.playTweet = function() {
    var i = Math.floor(Math.random()*module.tweets.length);
    var tweet = module.tweets[i].text;
    console.log(tweet);
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    tweet = tweet.replace(urlRegex, ''); // remove urls
    tweet = tweet.replace(/[-#'&…,.@():;|{}_=+<>~"`“”’?0123456789/[/]/g, ''); // remove punct
    tweet = tweet.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // trim trailing white
    console.log(tweet);
    tweet = tweet.substring(0, Math.min(tweet.length, 99));
    tweet = encodeURIComponent(tweet);
    console.log(tweet);
    var audio = new Audio();
    audio.src ="http://translate.google.com/translate_tts?ie=utf-8&tl=en&q=Notes%20from%20my%20visit%20to%20Haiti%20with%20global%20health%20hero%20Paul%20Farmer";     
    audio.play();
    setTimeout(module.playTweet, 1000);
  };


  // }

  return module;
};