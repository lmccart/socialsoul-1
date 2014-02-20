var page = require('webpage').create()
  , async = require('async')
  , fs = require('fs');

var data = fs.read('settings.json');
data = JSON.parse(data);

var step = 0;
var interval = data.interval;
var duration = data.duration;

var screens = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

async.eachSeries(screens, function(s, cb) {

  page.open('http://localhost:3000/controller?action=trigger', function() {

    page.open('http://localhost:3000/screen/'+s, function() {
      console.log(step);
      step = 0;
      grabScreen(s, cb);
    });
  });

},
function(err) {
  phantom.exit();
  console.log('ok');
});

function grabScreen(index, cb) {
  page.render('render/screen_'+index+'_'+step+'.png');
  console.log(step, interval, duration);
  step++;
  if (step*interval <= duration) {
    setTimeout(function(){grabScreen(index, cb);}, interval);
  } else {
    cb(null);
  }
}