var page = require('webpage').create();
var async = require('async');

var time = 0;
var interval = 1*1000;
var duration = 10*1000;


var screens = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

async.eachSeries(screens, function(s, cb) {

  page.open('http://localhost:3000/controller?action=trigger', function() {

    page.open('http://localhost:3000/screen/'+s, function() {
      time = 0;
      grabScreen(s, cb);
    });
  });

},
function(err) {
  phantom.exit();
  console.log('ok');
});

function grabScreen(index, cb) {
  page.render('render/screen_'+index+'_'+Math.floor(time/interval)+'.png');
  time += interval;
  if (time <= duration) {
    setTimeout(function(){grabScreen(index, cb);}, interval);
  } else {
    cb(null);
  }
}