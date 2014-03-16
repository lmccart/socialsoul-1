// main just handles the routing of socket.io messages

window.onload = function() {
  if (screenId%4 == 0) {
  } else if (screenId%4 == 1) {
    $('body').addClass('mirrorX');
  } else if (screenId%4 == 2) {
    $('body').addClass('flip180');
  } else if (screenId%4 == 3) {
    $('body').addClass('mirrorX');
    $('body').addClass('flip180');
  }

  var manager = new Manager();

  var host = window.location.host.indexOf('localhost') !== -1 ? 'http://localhost:3030' : 'http://socialsoulserver.local:3030';
  var socket = io.connect(host); 
  
  socket.emit('send', { message: 'hello from frontend' });

  socket.on('sync', function (data) {
    ServerTime.init(data.serverTime);
    console.log("synced with server (" + ServerTime.getTimeOffset() + " ms offset)");
    manager.sync();
  });

  // new subject available
  socket.on('trigger', function (data) {
    console.info('socket trigger');
    console.info(data);
    manager.trigger(data);
  });

  // subject's mentor available
  socket.on('mentor', function (data) {
    console.info('socket mentor');
    console.info(data);
    manager.mentor(data);
  });

  // new media available
  socket.on('asset', function (data) {
    // console.info('socket asset');
    // console.info(data);
    // convert from backend to frontend directory
    data.file = data.file.replace(/.+public/, "..");
    manager.addAsset(data);
  });

  // refresh the page when node restarts
  socket.on('reconnect', function() {
    console.info('reconnect');
    location.reload();
  });

}