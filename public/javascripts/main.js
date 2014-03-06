var ServerTime = (function() {
  var timeOffset = 0;
  return {
    init: function(serverTime) {
      this.timeOffset = serverTime - Date.now();
    },
    now: function() {
      return Date.now() + timeOffset;
    }
  }
}());

var screenId = window.location.pathname.split("/")[2];

window.onload = function() {
  console.log('load');
  var manager = new Manager();
  var host = window.location.host.indexOf('localhost') !== -1 ? 'http://localhost' : 'http://socialsoulserver.local';
  var socket = io.connect(host); 
  
  socket.emit('send', { message: 'hello from frontend' });

  socket.on('message', function (data) {
    console.log(data);
  });

  socket.on('sync', function (data) {
    ServerTime.init(data.serverTime);
  });

  socket.on('trigger', function (data) {
  	console.log('trigger '+data.user);
    manager.reset();
    manager.init(data);
  });

  // assets
  socket.on('assets', function (data) {
    console.log('assets '+data.dir);
    manager.addAssets(data);
  });

  socket.on('asset', function (data) {
    console.log('asset '+data.file);
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