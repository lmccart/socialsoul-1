
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , config = require('./data/config')
  , controller = require('./controller')(config)

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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', function(req, res) {
  res.render('index', { id: 'all' });
});

app.get('/screen/:id', function(req, res) {
  res.render('screen', { id: req.params.id });
});

app.get('/controller', function(req, res) {
  // splitting this because trigger needs to wait for
  // callback to render controller with status msg
  if (req.query.action === 'trigger') {
    controller.start(req.query.user, function() { renderController(res); });
  } else {
    if (req.query.action === 'queue_user') {
      controller.queueUser(req.query.user);
    }
    else if (req.query.action === 'build_db') {
      console.log('building db');
      controller.buildDb();
    }
    renderController(res);
  }
});

app.get('/storage', function(req, res){
  controller.storage.all(function(error, entries){
    res.render('storage', { entries: entries})
  });
});


function renderController(res) {
  res.render('controller', { cur_user: controller.cur_user, 
                             users: controller.queued_users, 
                             remaining: controller.getRemaining(),
                             error: controller.error });
}




var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  controller.addSocket(socket);
  socket.emit('message', { message: 'hello from the backend'});
  socket.emit('sync', { serverTime: Date.now()});
  socket.on('send', function (data) {
    console.log(data);
  });
});


app.use(express.static(path.join(__dirname, 'public')));


