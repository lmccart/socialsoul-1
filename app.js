
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var config = require('./data/config');
var controller = require('./controller')(config);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', function(req, res) {
  res.render('index', { title: 'Main' });
});

app.get('/controller', function(req, res) {
  res.render('controller', {});
  if (req.query.action === 'trigger') {
    controller.start();
  }
  else if (req.query.action === 'set_user') {
    console.log('user set to '+req.query.user);
    controller.next_user = req.query.user;
  }
});

app.get('/storage', function(req, res){
  controller.storage.all(function(error, entries){
    res.render('storage', { entries: entries})
  });
});



var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  controller.addSocket(socket);
  socket.emit('message', { message: 'hello from the backend' });
  socket.on('send', function (data) {
    console.log(data);
  });
});



