var Mode = function() {
  var module = {};
  module.init = function() {}
  module.next = function() {}
  module.update = function() {}
  module.exit = function() {}
  return module;
}

var DebugMode = function() {
  var module = new Mode();
  module.init = function(user) {
    var tweetText = "";
    for(var i = 0; i < user.tweets.length; i++) {
      tweetText += '<div class="tweet">' + user.tweets[i].text + '</div>';
    }
    $('body').append('<div class="debug" id="info">'+screenId+':'+user.user+'</div>');
    $('body').append('<img class="debug" id="profile"/>')
    $('body').append('<div class="debug">'+tweetText+'</div>');
    $('body').append('<div class="debug" id="files"></div>');
  }
  module.next = function(user) {
    if(user.profile) {
      document.getElementById('profile').src = user.profile; 
    }
    // rebuild all files
    $('#files').empty();
    for(var i = 0; i < user.files.length; i++) {
      if (user.files[i].indexOf('.mp4') !== -1) { // append vine
        $('#files').append('<object data="'+user.files[i]+'" />');
      } else { // append image
        $('#files').append('<img src="'+user.files[i]+'" />');
      }
    }
  }
  return module;
};

// the entrance is pulsing white to black on the centermost two screens
// everything else is black
var EnterMode = function() {
  var module = new Mode();
  var timeline = {};
  module.init = function() {
    // the browser can barely handle this at 60fps, maybe should be webgl
    if(screenId == 0) {
      $('body').append('<div class="fullscreen whitebg" id="color"></div>');
      timeline = new TimelineMax();
      timeline
        .set("#color", {opacity:1})
        .to("#color", 3, {opacity:0, ease:Power2.easeIn})
        .repeat(-1);
    } else {
      $('body').append('<div class="fullscreen blackbg" id="color"></div>');
    }
  }
  return module;
};

var AllImagesMode = function() {
  var module = new Mode();
  return module;
}

// one scene involves flashing single words briefly in the center
// with the font randomly selected, and mosaic images in the background
var CenteredTextMode = function() {
  var module = new Mode();
  var salientWords = [];
  var ctx = {};
  module.init = function(user) {
    $('body').append('<canvas id="centeredTextCanvas"></canvas>');
    $('body').append('<div class="centeredText"><span id="centeredWord"></span></div>');

    // replace this with backend salient words
    if (user.tweets) {
      for(i in user.tweets) {
        var tokens = user.tweets[i].text.split(' ');
        for(j in tokens) {
          if(tokens[j].length > 4 && tokens[j].length < 12)
          salientWords.push(tokens[j]);
        }
      }
    }

    var canvas = document.getElementById('centeredTextCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
  }
  module.update = function(user) {
    if(user.files.length > 0) { 
      var img = new Image();
      img.src = randomChoice(user.files);
      img.onload = function() {
        var width = img.width;
        var height = img.height;
        var fullscreen = Math.random() < .2;
        var scale;
        if(fullscreen) {
          var widthScale = window.innerWidth / width;
          var heightScale = window.innerHeight / height;
          scale = Math.max(widthScale, heightScale);
        } else {
          var pixelCount = randomPowerOfTwo();
          scale = window.innerWidth / pixelCount;
        }
        ctx.drawImage(img, 0, 0, scale * width, scale * height);
        var sampleSize = 1000;
        var stepSize = Math.floor(width * height / sampleSize);
        stepSize = Math.min(stepSize, 1);
        var clusters = colorThief.getPalette(img, 4, stepSize);
        clusters = _.shuffle(clusters);
        $('#centeredWord').text(randomChoice(salientWords));
        $('#centeredWord').css({
          fontFamily: randomChoice(fonts),
          backgroundColor: rgb(clusters[0]),
          color: rgb(clusters[1])
        });
      }
    }
  }
  return module;
};

var ThreeMode = function() {
  var module = new Mode();
  
  var container;
  var camera, scene, renderer;
  var uniforms, material, mesh;
  var mouseX = 0, mouseY = 0,
  lat = 0, lon = 0, phy = 0, theta = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  module.init = function() {
    container = document.body;
    camera = new THREE.Camera();
    camera.position.z = 1;
    scene = new THREE.Scene();
    uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() }
    };
    material = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    } );
    mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
    scene.add( mesh );
    renderer = new THREE.WebGLRenderer();
    container.appendChild( renderer.domElement );
    
    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  module.update = function() {
    uniforms.time.value += .05;// Math.floor(Date.now()) / 1000.;
    renderer.render( scene, camera );    
  }
  return module;
}

// easy way to display the username, need to work on this
var TextillateMode = function() {
  var module = new Mode();
  module.init = function(user) {
    console.log(user);
    $('body').append('<div class="centeredText"><span id="centeredWord"></span></div>');
    $('#centeredWord').text(user.user);
    $('#centeredWord').textillate({
      selector: '.texts',
      loop: true,
      minDisplayTime: 2000,
      initialDelay: 0,
      in: {
        effect: 'wobble',
        delayScale: 1.5,
        delay: 50,
        sync: false,
        reverse: false,
        shuffle: false,
        callback: function () {}
      },
      out: {
        effect: 'none'
      },
      autoStart: true,
      inEffects: [],
      outEffects: [],
      callback: function () {}
    });
  }
  return module;
}

// the break should be quick pulsing of the whole space
// ideally in sync, or starting out of sync and coming into sync
var BreakMode = function() {
  var module = new Mode();
  var timeline = {};
  module.init = function() {
    $('body').append('<div class="fullscreen whitebg" id="color"></div>');
    timeline = new TimelineMax();
    timeline
      .set("#color", {opacity:1})
      .to("#color", .5, {opacity:0, ease:Power2.easeIn})
      .repeat(-1);
  }
  return module;
};

// exit is just white on all screens
var ExitMode = function() {
  var module = new Mode();
  module.init = function() {
    $('body').append('<div class="fullscreen whitebg"></div>');
  };
  return module;
};

