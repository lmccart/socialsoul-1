module.exports = (function() {
  'use strict';

  // Components
  var request = require('request');

  // Options
  var opts = {
    address: 'https://vine.co/v/',
    pattern: /https:\/\/[A-Za-z0-9_.]*\/r\/videos\/[A-Za-z0-9_.]*/g,
    dir: './'
  };

  return {
    // Parses vine page and downloads the given video
    download: function(vine_id, options) {
      // check for vine_id
      if(!vine_id) throw 'You must supply a valid id.';
      // default parameter
      options = options || {};
      // define callback if found
      var cb = options.success || undefined;
      // define save dir
      var dir = options.dir || opts.dir;
      // check callback is valid
      if(cb && typeof cb != 'function') throw 'You must supply a callback';
      // assign address
      var address = opts.address;
      // override request options if we requested it
      var r_options = options.request || { method: 'GET', uri: address + vine_id, headers: { 'User-Agent' : 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:26.0) Gecko/20100101 Firefox/26.0' } };
      // send the request
      request(r_options, function(err, response, body) {
        if(err) cb('error '+err);
        if(response.statusCode === 404) {
          cb('404 '+err);
          return;
        }
        var pattern = options.pattern || opts.pattern; // override pattern if script breaks
        var links = body.match(pattern); // should match twice on the page if we're successful
        if(links) {
          // select link
          var selected = links[0];
          // get request (will throw error if request was invalid)
          var r = request.get(selected);
          // return request
          var filename = dir + vine_id + '.mp4';
          r.pipe(require('fs').createWriteStream(filename)).on('close', function(err) {
            cb(filename);
          }).on('error', function(err) {
            console.log('Error caught and ignored: ' +err);
            callback(filename);
          });
        }
        else cb(null);
      }); 
    }
  }
})();