
var _ = require('underscore')
  , domain = require('domain')
  , twitter = require('ntwitter')
  , request = require('request')
  , fs = require('fs-extra')
  , _ = require('underscore')
  , async = require('async')
  , mmm = require('mmmagic')
  , natural = require('natural')
  , similarity = require('./similarity')
  , scraper = require('./scraper');

// uncaught error handling
var d = domain.create();
d.on('error', function(err) {
  console.error('DOMAIN ERROR caught and handled: '+err);
});

var verbose = false;


// load word lists and regex
var url_regex = /(https?:\/\/[^\s]+)/g;
var filtered_regex;  
fs.readFile(__dirname +'/data/filtered.txt', 'utf8', function(err, data) {
  if (err) console.log(err);
  filtered_regex = new RegExp( data.split('\n').join("|") ,"gi");
});
var common_words = [];
fs.readFile(__dirname +'/data/common.txt', 'utf8', function(err, data) {
  if (err) console.log(err);
  common_words = data.split('\n');
});


var magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);

var assets_root = __dirname +'/public/assets/';
var requests = [];


module.exports = function(config, io) {
 
  var default_user = 'Random speaker';

  var controller = {
    io: io,
    cur_user: null,
    queued_users: [default_user], // pend temp for testing
    storage: require('./storage')(),
    start_time: 0,
    run_time: 2*60*1000, // pend temp
    error: null // for status ping
  };


  var twit = new twitter(config.creds);

  twit.stream('statuses/filter', {track:'#socialsoul'}, function(stream) {
    stream.on('data', function (data) {
      controller.queueUser(data.user.screen_name);
      controller.sync();
    });
  });

  controller.sync = function() {
    io.sockets.emit('sync', {
      cur_user: controller.cur_user, 
      users: controller.queued_users, 
      remaining: controller.getRemaining(),
      error: controller.error,
      serverTime: Date.now()
    });
  };

  // manual override of next user, triggered by controller app
  controller.queueUser = function(user) {

    var match = _.filter(controller.queued_users, function(u) { return ~u.toLowerCase().indexOf(user.toLowerCase())});
    if (!match.length > 0) {
      controller.queued_users.push(user);
      console.log('queueing user '+user);
    } else console.log('user '+user+' already in queue');
  };

  // removes user from queue
  controller.removeUser = function(user) {
    controller.queued_users = _.without(controller.queued_users, user);
  }

  // go message received from controller app
  // determines next user, does cleanup, then calls start
  controller.trigger = function(user) {

    var is_def = user === default_user;
    if (is_def) {
      var defs = controller.storage.default_users;
      user = defs[Math.floor(Math.random()*defs.length)];
      if (verbose) console.log('choosing default user: '+user);
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

    getPerson({user:user, get_media:true, send_tweet:!is_def, cb:function(){}});

  }


  controller.buildDb = function() {

    fs.remove(assets_root+'mentors/', function(err) {

      fs.readFile(__dirname +'/data/mentors.txt', 'utf8', function(err, data) {
        if (err) console.log(err);
        data = data.split('\n');
        controller.storage.reset(function() {
          async.eachSeries(data, function(mentor, cb) {
            getPerson({user:mentor, init:true, cb:cb});
          }, function () {
            controller.storage.updateDefaultUsers();
            console.log('downloaded ');
          });
        });
      });
    });
  };  

  controller.testAlgo = function() {
    controller.storage.all(function(err, people) {
      people.forEach(function(p) {
        findMentor(p.user, p.text, false, true);
      });
    });
  };

  controller.getRemaining = function() {
    return Math.max(0, controller.run_time - (new Date() - controller.start_time));
  };

  // opts -- user, get_media, send_tweet, is_mentor, cb, init
  function getPerson(opts) {

    var dir = assets_root+'mentors/'+opts.user+'/';
    console.log('grabbing tweets for '+opts.user);

   
    fs.readJson(dir+'timeline.json', function(err, data) {
      if (data) {
        handleTimeline(dir, data, opts);
      } else {
        twit.getUserTimeline({screen_name:opts.user, count:200}, function(err, data) { 
          // render controller once user status is known
          if (err) {
            console.log(err);
            if (err.statusCode === 404) {
              io.sockets.emit('error', {msg: 'User '+opts.user+' does not exist.'});
            } else if (err.statusCode === 401) {
              io.sockets.emit('error', {msg: 'User '+opts.user+' is protected. Please try another user.'});
            }
          } else {
            handleTimeline(dir, data, opts, true);
          }

        });
      }
    });
  }

  function handleTimeline(dir, data, opts, is_new) {

    controller.error = null; 

    // insert text in db
    console.log('inserting '+opts.user+' in db');
    var salient = get_salient(data);
    var obj = { 
      user: opts.user,
      text: normalize(salient.join(' ')),
      name: data[0].user.name
    };
    controller.storage.insert(obj);



    if (!opts.init) {
      var msg_name = opts.is_mentor ? 'mentor' : 'trigger';

      if (is_new) data = get_clean(data); // only clean if new

      controller.io.sockets.emit(msg_name, {
        'user':opts.user,
        'name':obj.name,
        'tweets':data,
        'salient':salient,
        'remaining': controller.getRemaining()
      }); 

    }

    if (opts.get_media) {
      fs.mkdirs(dir, function() {

        // save salient // test pend
        if (is_new) fs.outputFile(dir+'salient.txt', salient.join('\r\n'), function(e){ if (e) console.log(e); });

        // save json
        if (is_new) fs.outputJson(dir+'timeline.json', data, function(e){ if (e) console.log(e); });
        // download media
        var media_timeline = 'http://twitter.com/i/profiles/show/'+opts.user+'/media_timeline?include_available_features=0&include_entities=0&last_note_ts=0&max_id=9199999999999999999&oldest_unread_id=0';
        scrape(dir, media_timeline, opts.is_mentor, opts.cb, true);


        fs.readJson(dir+'friends.json', function(err, friends_data) {
          if (friends_data) handleFriends(dir, friends_data, opts);
          else {
            twit.getFriendsList({screen_name:opts.user, count:200}, function(err, friends_data) { 
              if (err) console.log(err);
              else {
                handleFriends(dir, friends_data, opts, true);
              }

            });
          }
        });

        downloadMedia(dir, data, opts.is_mentor, function(res) { 
          if (verbose) console.log('downloaded '+res+' remaining: '+queue.length()+' reqs: '+requests.length); 
          if (opts.cb) opts.cb();
        });

        if (!opts.is_mentor && !opts.init) findMentor(opts.user, obj.text, opts.send_tweet);

      }); 
    } else {
      if (opts.cb) opts.cb();
    }
  }

  function handleFriends(dir, friends_data, opts, is_new) {
    // save json
    if (is_new) fs.outputJson(dir+'friends.json', friends_data, function(e){ if (e) console.log(e); });
  
    for (var i=0; i<friends_data.users.length; i++) {
      var profile = friends_data.users[i].profile_image_url.replace('_normal', '');
      queue.push({dir:dir, url:profile, tag:'friend', is_mentor:opts.is_mentor}, opts.cb);
    }
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
    scraper.scrape(uri, function(err, imgs){
      if (err) console.log('b err', uri);
      if (verbose) console.log(imgs);
      if (imgs) {
        for (var i=0; i<imgs.length; i++) {
          queue.push({dir:dir, url:imgs[i], is_mentor: is_mentor}, callback);
        }
      } 
    }, timeline);
  }

  //Set up our queue
  var queue = async.queue(function(obj, callback) {queue_run(obj, callback);}, 10); //Only allow 1 request at a time

  var queue_run = function(obj, callback) {
    d.run(function() {
      var filename = obj.url.substring(obj.url.lastIndexOf('/')+1);

      var ind = filename.indexOf('proxy.jpg?t=');
      if (ind !== -1) { // media timeline imgs are f'd
        filename = filename.substring(ind+12)+'.jpg';
      } 
      filename = filename.replace(':large', '');
      filename = filename.replace(/['&…,():;|{}_=+<>~"`/[/]/g, '');
      var ind = Math.max(filename.length-20, 0);
      filename = filename.substring(ind);
      filename = obj.dir+filename;

      fs.exists(filename, function(exists) {
        if (!exists) {
          if (obj.url.indexOf('vine.co') != -1) {
            var vine_id = obj.url.substring(obj.url.lastIndexOf('/')+1);  
            scraper.getVine(vine_id, {dir: obj.dir, success: callback});
          } else {
            var req = request(obj.url).pipe(fs.createWriteStream(filename)).on('close', function(err) {
              if (req.bytesWritten > 4000) { // only send if bigger than 4kb
                magic.detectFile(filename, function(err, res) {
                  if (err) { console.log("Error caught and ignored "+err) 
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
          if (verbose) console.log(filename+' exists');
          controller.io.sockets.emit('asset', {
            'file':filename,
            'tag':obj.tag,
            'is_mentor':obj.is_mentor
          }); 
          callback(filename);
        }
      });
    });
  };

  //When the queue is emptied we want to check if we're done
  queue.drain = function() {
    if (queue.length() == 0 ) { //&& listObjectsDone) {
      if (verbose) console.log('ALL files have been downloaded');
    }
  };

  function findMentor(user, text, send_tweet, test) {

    // pick related mentor
    var low = 0, lowKey = '';
    var high = 0, highKey = '';

    controller.storage.all(function(err, data) {
      for (var i=0; i<data.length; i++) {
        if (data[i].user != user) {
          var rating = similarity.tokenCosineSimilarity(text, data[i].text);
          if (verbose) console.log(data[i].user+' '+rating);
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
      if (verbose) console.log(highKey + " similarity " + high);
      
      // for testing algo
      if (test) console.log('match for '+user+': '+highKey+' ('+high+')'); 
      else getPerson({user:highKey, is_mentor:true, get_media:true}); 
      
      if (send_tweet) {
       setTimeout(function(){ sendEndTweet(user, highKey); }, controller.run_time); 
      }
    });
  }

  function get_salient(data) {
    var salient = [];
    for (var i=0; i<data.length; i++) {
      var tweet = data[i].text;
      
      tweet = tweet.replace(/['…,.():;|{}_=+<>~"`/[/]/g, '').replace(/[-–/]/g, ' ');

      var tokens = tweet.split(' ');
      tokens.forEach(function(tok) {
        if (tok.length > 4 && tok.length < 12) {
          var common = false;
          for (var i=0; i<common_words.length; i++) {
            if (common_words[i] == tok.toLowerCase()) {
              common = true;
              break;
            }
          }
          if (!common) {
            salient.push(tok);
          }
        }
      });
    }
    return salient;
  }

  // removes urls and banned words
  function get_clean(data) {
    for (var i=0; i<data.length; i++) {
      data[i].text = data[i].text.replace(url_regex, '');
      data[i].text = data[i].text.replace(filtered_regex, '');
    }

    return data;
  }

  function normalize(text) {
    natural.LancasterStemmer.attach();
    // maybe need to remove urls too
    return text.tokenizeAndStem();
  }

  function sendEndTweet(user, name) {
    var status = '@'+user+' your social soulmate is @'+name+'. To make more connections, explore Innovation Class http://www.deltainnovationclass.com';
    twit.updateStatus(status, function(err) { console.log(err); });
  }


  return controller;
};