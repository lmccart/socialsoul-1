var request = require('request')
  , cheerio = require('cheerio');



module.exports = {

  scrape: function(options, callback, timeline){

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
  }

  
};

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
