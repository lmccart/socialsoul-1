
var _ = require('underscore')
  , twitter = require('ntwitter')
  , request = require('request')
  , fs = require('fs-extra')
  , _ = require('underscore')
  , async = require('async')
  , beagle = require('beagle')
  , natural = require('natural')
  , similarity = require('./similarity')
  , vine = require('./vinegrab')
  , mmm = require('mmmagic')
  , cheerio = require('cheerio');

var magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);

var assets_root = __dirname +'/public/assets/';
var requests = [];

module.exports = function(config, io) {
 
  var default_user = '*DEFAULT*';

  var controller = {
    io: io,
    cur_user: null,
    queued_users: [default_user, 'kcimc', 'FunnyVines', 'laurmccarthy'], // pend temp for testing
    storage: require('./storage')(),
    start_time: 0,
    run_time: 60*1000, // pend temp
    error: null // for status ping
  };
  

  var twit = new twitter(config.creds);

  twit.stream('statuses/filter', {track:'#sstest'}, function(stream) {
    stream.on('data', function (data) {
      controller.queued_users.push(data.user.screen_name);
      console.log('queueing user '+data.user.screen_name);
    });
  });

  // manual override of next user, triggered by controller app
  controller.queueUser = function(user) {

    var match = _.filter(controller.queued_users, function(u) { return ~u.toLowerCase().indexOf(user.toLowerCase())});
    console.log(match);
    if (!match.length > 0) {
      controller.queued_users.push(user);
      console.log('queueing user '+user);
    } else console.log('user '+user+' already in queue');
  };

  // go message received from controller app
  // determines next user, does cleanup, then calls start
  controller.trigger = function(user, callback) {

    var is_def = user === default_user;
    if (is_def) {
      console.log(controller.storage);
      var defs = controller.storage.default_users;
      user = defs[Math.floor(Math.random()*defs.length)];
      console.log('choosing default user: '+user);
    }
      
    // CLEANUP
    // remove queued tasks
    while(queue.length() > 0) {
      queue.tasks.pop();
    }

    // destroy pending requests
    for (var i=0; i<requests.length; i++) {
      requests[i].destroy();
    }
    requests = [];

    // START NEW
    console.log('start with user '+user);
    controller.start_time = new Date();
    controller.cur_user = user;
    controller.queued_users = _.without(controller.queued_users, user); 

    getPerson({user:user, get_media:true, is_def:true, cb:callback});

  }


  controller.buildDb = function() {

    fs.remove(assets_root+'mentors/', function(err) {
      fs.readJson('./data/mentors.json', function(err, data) {
        controller.storage.reset(function() {
          async.eachSeries(data, function(mentor, cb) {
            getPerson({user:mentor.user, init:true, cb:cb});
          }, function () {
            controller.storage.updateDefaultUsers();
            console.log('downloaded ');
          });
        });
      });
    });

  };

  controller.getRemaining = function() {
    return Math.max(0, controller.run_time - (new Date() - controller.start_time));
  };

  // opts -- user, get_media, send_tweet, is_def, is_mentor, cb, init
  function getPerson(opts) {

    var dir = assets_root+'mentors/'+opts.user+'/';
    console.log('grabbing tweets for '+opts.user);

    twit.getUserTimeline({screen_name:opts.user}, function(err, data) { 
      // render controller once user status is known
      if (err) {
        console.log(err);
        if (err.statusCode === 404) {
          controller.error = 'User '+user+' does not exist.';
        } else {
          controller.error = 'Something went wrong, please try again. ('+err+')';
        }
      } else {

        controller.error = null; 

        // insert text in db
        console.log('inserting '+opts.user+' in db');
        
        var obj = { 
          user: opts.user,
          text: concat_tweets(data),
          name: data[0].user.name
        };
        controller.storage.insert(obj);

        if (!opts.init) {
          var msg_name = opts.is_mentor ? 'mentor' : 'trigger';

          controller.io.sockets.emit(msg_name, {
            'user':opts.user,
            'tweets':data,
            'salient':get_salient(data)
          }); 

        }

        if (opts.get_media) {
          fs.mkdirs(dir, function() {

            // save salient // test pend
            fs.outputFile(dir+'salient.txt', get_salient(data).join('\r\n'), function(e){ if (e) console.log(e); });

            // save json
            fs.outputJson(dir+'timeline.json', data, function(e){ if (e) console.log(e); });
            // download media
            var media_timeline = 'http://twitter.com/i/profiles/show/'+opts.user+'/media_timeline?include_available_features=0&include_entities=0&last_note_ts=0&max_id=412320714281082880&oldest_unread_id=0';
            scrape(dir, media_timeline, opts.is_mentor, opts.cb, true);

            downloadMedia(dir, data, opts.is_mentor, function(res) { 
              console.log('downloaded '+res+' remaining: '+queue.length()+' reqs: '+requests.length); 
              if (opts.cb) opts.cb();
            });

            if (!opts.is_mentor && !opts.init) findMentor(opts.user, obj.text, opts.send_tweet);

          }); 
        } else {
          if (opts.cb) opts.cb();
        }
      }

    });
  }

  function downloadMedia(dir, data, is_mentor, callback) {

    // get profile pic
    if (data.length > 0) {
      var profile = data[0].user.profile_image_url.replace('_normal', '');
      queue.push({dir:dir, url:profile, tag:'profile', is_mentor:is_mentor}, callback);
      queue.push({dir:dir, url:data[0].user.profile_background_image_url, tag:'background', is_mentor:is_mentor}, callback);
    }
    

    // download media
    for (var i=0; i<data.length; i++) {

      var media = data[i].entities.media;
      if (media) {
        for (var j=0; j<media.length; j++) {
          queue.push({dir:dir, url:media[j].media_url, is_mentor:is_mentor}, callback);
        }
      }
      var urls = data[i].entities.urls;
      if (urls) {
        for (var j=0; j<urls.length; j++) {
          if (urls[j].expanded_url.indexOf('vine.co') !== -1) {
            queue.push({dir:dir, url:urls[j].expanded_url, is_mentor:is_mentor}, callback);
          } else {
            //scrape(dir, urls[j].expanded_url, is_mentor, callback, false);
          }
        }
      }
    }
  }



  function scrape(dir, uri, is_mentor, callback, timeline) {
    beagle.scrape(uri, function(err, bone){
      if (err) console.log('b err', uri);
      if (bone) {
        for (var i=0; i<bone.images.length; i++) {
          queue.push({dir:dir, url:bone.images[i], is_mentor: is_mentor}, callback);
        }
      } 
    }, timeline);
  }

  //Set up our queue
  var queue = async.queue(function(obj, callback) {

    var filename = obj.url.substring(obj.url.lastIndexOf('/')+1);

    var ind = filename.indexOf('proxy.jpg?t=');
    if (ind !== -1) { // media timeline imgs are f'd
      filename = filename.substring(ind+12)+'.jpg';
    } else {
      filename = filename.replace(/['…,():;|{}_=+<>~"`/[/]/g, '');
    }
    filename = obj.dir+filename;

    fs.exists(filename, function(exists) {
      if (!exists) {
        if (obj.url.indexOf('vine.co') != -1) {
          var vine_id = obj.url.substring(obj.url.lastIndexOf('/')+1);  
          vine.download(vine_id, {dir: obj.dir, success: callback});
        } else {
          var req = request(obj.url).pipe(fs.createWriteStream(filename)).on('close', function(err) {
            if (req.bytesWritten > 4000) { // only send if bigger than 4kb
              magic.detectFile(filename, function(err, res) {
                if (err) {
                  console.log("MAGIC ERR") 
                } else if (res == 'image/jpeg' || res == 'image/png' || res == 'image/gif') {
                  controller.io.sockets.emit('asset', {
                    'file':filename,
                    'tag':obj.tag,
                    'is_mentor':obj.is_mentor
                  }); 
                }
              });
            } 
            callback(filename);
          }).on('error', function(err) {
            console.log('Error caught and ignored: ' +err);
            callback(filename);
          });
          requests.push(req);
        } 
      } else {
        console.log(filename+' exists');
        callback(filename);
      }
    });
  }, 10); //Only allow 1 request at a time

  //When the queue is emptied we want to check if we're done
  queue.drain = function() {
    if (queue.length() == 0 ) { //&& listObjectsDone) {
      console.log('ALL files have been downloaded');
    }
  };

  function findMentor(user, text, send_tweet) {

    // pick related mentor
    var low = 0, lowKey = '';
    var high = 0, highKey = '';

    controller.storage.all(function(err, data) {
      for (var i=0; i<data.length; i++) {
        if (data[i].user != user) {
          var rating = similarity.tokenCosineSimilarity(text, data[i].text);
          console.log(data[i].user+' '+rating);
          if(low == 0 || rating < low) {
            low = rating;
            lowKey = data[i].user;
          }
          if(high == 0 || rating > high) {
            high = rating;
            highKey = data[i].user;
          }
        }
      }
      console.log(highKey + " similarity " + high);
      getPerson({user:highKey, is_mentor:true, get_media:true});
      if (send_tweet) {
       //setTimeout(function(){ sendEndTweet(user, highKey); }, 120*1000); //pend: out for now until launch
      }
    });

  }

  function get_salient(data) {
    var salient = [];
    for (var i=0; i<data.length; i++) {
      var tweet = data[i].text;
      tweet = tweet.replace(/['…,.():;|{}_=+<>~"`/[/]/g, '').replace(/[-–/]/g, ' ');
      var tokens = tweet.split(' ');
      for (var j=0; j<tokens.length; j++) {
        if (tokens[j].length > 4 && tokens[j].length < 12 && 
          tokens[j].indexOf('http') === -1) {
          salient.push(tokens[j]);
        }
      }
    }
    
    return salient;
  }


  function concat_tweets(data) {
    var text = '';
    for (var i=0; i<data.length; i++) {
      text += data[i].text+' ';
    }
    text = normalize(text);
    return text;
  }

  function normalize(text) {
    natural.LancasterStemmer.attach();
    // maybe need to remove urls too
    return text.tokenizeAndStem();
  }

  function sendEndTweet(user, name) {
    twit.updateStatus('@'+user+' your social soulmate is @'+name,
      function(err) {console.log(err); });
  }



  return controller;
};