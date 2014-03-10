var request = require('request')
  , cheerio = require('cheerio');



module.exports = function() {

  var scraper = {};

  var vine_opts = {
    address: 'https://vine.co/v/',
    pattern: /https:\/\/[A-Za-z0-9_.]*\/r\/videos\/[A-Za-z0-9_.]*/g,
    dir: './'
  };

  scraper.scrape = function(options, callback, timeline){

    if (typeof options === 'object' && !options.url && !options.uri) {
      callback(new Error("cannot scrape that, expected property 'url' or 'uri'"));
      return;
    }

    request(options, function (error, response, body) {
      if (error) {
        callback(error);
        return;
      }
      callback(null, scrapeImages(response, timeline));
    });

    return;
  };

  scraper.getVine = function(vine_id, options) {
    // check for vine_id
    if(!vine_id) throw 'You must supply a valid id.';
    // default parameter
    options = options || {};
    // define callback if found
    var cb = options.success || undefined;
    // define save dir
    var dir = options.dir || vine_opts.dir;
    // check callback is valid
    if(cb && typeof cb != 'function') throw 'You must supply a callback';
    // assign address
    var address = vine_opts.address;
    // override request options if we requested it
    var r_options = options.request || { method: 'GET', uri: address + vine_id, headers: { 'User-Agent' : 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:26.0) Gecko/20100101 Firefox/26.0' } };
    // send the request
    request(r_options, function(err, response, body) {
      if(err) cb('error '+err);
      if(response.statusCode === 404) {
        cb('404 '+err);
        return;
      }
      var pattern = options.pattern || vine_opts.pattern; // override pattern if script breaks
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
          cb(filename);
        });
      }
      else cb(null);
    }); 
  };

  return scraper;

}();

function scrapeImages(response, timeline) {

  var images = [];

  var uri = response.request.uri;
  var url = uri.href;
  var origin = uri.protocol + '//' + uri.host;

  body = response.body;

  if (timeline) {
    body = JSON.parse(body);
    this.$ = cheerio.load(body.items_html);
  } else {
    this.$ = cheerio.load(this.body);
  }

  function addImg(image){
    if (image) {
      if(image.indexOf('http') == -1) {
        image = origin + '/' + image;
      }
      images.push(image);
      return true;
    }
    return false;
  }

   // twitter media timeline
  if (timeline) {
    var thumbs = $('.media-thumbnail');
    for (var i=0; i<thumbs.length; i++) {
      if (thumbs[i]['attribs'] && thumbs[i]['attribs']['data-resolved-url-large']) {
        addImg(thumbs[i]['attribs']['data-resolved-url-large']);
      }
    }
  } else {
    if (!addImg(getTagValue($, "meta", "property", "og:image", "content"))) {

      if (!addImg(getTagValue($, "link", "rel", "image_src", "href"))) {

        var imagesFound = $('img');
        if (imagesFound.length > 0) {
          addImg(imagesFound.eq(0).attr('src'));
        }

      }
    }
  }
  console.log(images);
  return images;
}

function getTagValue($, tagName, property, name, attr) {
  var value = $(tagName + "[" + property + "*='" + name + "']");

  if (value.length > 0){
    return value['0'].attribs[attr];
  }

  return null;
}
