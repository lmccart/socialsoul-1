window.onload = function() {

  var manager = new Manager();
  var host = window.location.host.indexOf('localhost') !== -1 ? 'http://localhost' : 'http://socialsoulserver.local';
  var socket = io.connect(host); 
  
  socket.emit('send', { message: 'hello from frontend' });

  socket.on('sync', function (data) {
    ServerTime.init(data.serverTime);
    console.log("synced with server @ " + ServerTime.now().toLocaleString() + " (" + ServerTime.getTimeOffset() + " ms offset)");
    manager.sync();
  });

  socket.on('trigger', function (data) {
  	console.log('trigger '+data.user);
    manager.reset();
    manager.init(data);
  });

  // assets
  socket.on('assets', function (data) {
    // console.log('assets '+data.dir);
    manager.addAssets(data);
  });

  socket.on('asset', function (data) {
    // console.log('asset '+data.file);
    manager.addAsset(data);
  });


  socket.on('reconnect', function() {
    location.reload();
  });

  (function animloop(){
    requestAnimationFrame(animloop);
    manager.update();
  })();
}