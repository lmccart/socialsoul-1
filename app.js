
/**
 * Module dependencies.
 */

var express = require('express')
  , config = require('./data/config');

var app = express();

// all environments
app.set('port', process.env.PORT || 3030);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);


var io = require('socket.io').listen(app.get('port'));
var controller = require('./controller')(config, io);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


io.sockets.on('connection', function (socket) {

  socket.emit('message', { message: 'hello from the backend'});
  sync();
  socket.on('send', function (data) {
    console.log(data);
  });

  socket.on('controller', function(data) {
    if (data.action === 'update') {
      sync();
    } else if (data.action === 'queue_user') {
      controller.queueUser(data.user);
      sync();
    } else if (data.action === 'remove') {
      controller.removeUser(data.user);
      sync();
    } else if (data.action === 'trigger') {
      controller.trigger(data.user);
      sync();
    } else if (data.action === 'build_db') {
      console.log('building db');
      controller.buildDb();
    }
  });

  function sync() {
    socket.emit('sync', {
      cur_user: controller.cur_user, 
      users: controller.queued_users, 
      remaining: controller.getRemaining(),
      error: controller.error,
      serverTime: Date.now()
    });
  }

});


