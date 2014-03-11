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
  module.init = function(user) {
    // the browser can barely handle this at 60fps, maybe should be webgl
    if(screenId == 0) {
      $('body').append('<div class="fullscreen whitebg" id="color"><div class="centered"><div class="middle"><div class="inner"><span class="text" id="word">'+user.user+'</span></div></div></div></div>');
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
  module.timeout = new VariableTimeout();
  module.init = function(user) {
    alive = true;
    $('body').append('<div class="allImages" id="container"></div>');
    var n = 5 * 8; // enough images to fill the screen at 240x240 each
    for(var i = 0; i < n; i++) {
      if(Math.random() < .5) {
        $('#container').append('<div class="wrapper"><img src="../images/placeholder.png"/></div>');
      } else {
        $('#container').append(
          '<div class="wrapper">'+
          '<div class="wrapper smaller"><img src="../images/placeholder.png"/></div>'+
          '<div class="wrapper smaller"><img src="../images/placeholder.png"/></div>'+
          '<div class="wrapper smaller"><img src="../images/placeholder.png"/></div>'+
          '<div class="wrapper smaller"><img src="../images/placeholder.png"/></div>'+
          '</div>');
      }
    }
    module.timeout.start(function() {
      if(user.files.length) {
        $('img').each(function(){
          if(Math.random() < .1) {
            this.src=randomChoice(user.files);
            // could add some more randomization of positions here
            // so they're not all top-left aligned
          }
        })
      }
    },
    // 30 + 30 * screenId); // subject
    390 + 30 * screenId); // mentor
  }
  module.exit = function() {
    module.timeout.stop();
  }
  return module;
}


// a single large tweet with black background
var TweetMode = function() {
  var module = new Mode();
  var timeline = {};
  module.timeout = new VariableTimeout();
  module.init = function(user) {
    alive = true;
    $('body').append('<div class="centered"><div class="middle"><div class="inner" style="text-align: left"><span class="text" id="tweet"></span></div></div></div>');
    timeline = new TimelineMax();
    module.timeout.start(function() {
      $('#tweet').hide();
      $('#tweet').text(randomChoice(user.tweets).text);
      $('#tweet').css({fontFamily: randomChoice(fonts)});
      $('#tweet').show();
      timeline
        .clear()
        .set('#tweet', {opacity:1})
        .to('#tweet', 4, {opacity:0, ease:Power2.easeIn});
    },
    // 5000 + (screenId * 500)); // subject
    5000 - (screenId * 500)); // mentor
  }
  module.exit = function() {
    module.timeout.stop();
  }
  return module;
};

// one scene involves flashing single words briefly in the center
// with the font randomly selected, and mosaic images in the background
var CenteredTextMode = function() {
  var module = new Mode();
  var salientWords = [];
  var ctx = {};
  module.timeout = new VariableTimeout();
  module.init = function(user) {
    $('body').append('<canvas id="centeredTextCanvas"></canvas>');
    $('body').append('<div class="centered"><div class="middle"><div class="inner"><span class="text" id="word"></span></div></div></div>');

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
  
    module.timeout.start(function() {
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
          var clusters = user.getPalette(img);
          clusters = _.shuffle(clusters);
          $('#word').hide();
          $('#word').text(randomChoice(salientWords));
          $('#word').css({
            fontFamily: randomChoice(fonts),
            backgroundColor: rgb(clusters[0]),
            color: rgb(clusters[1])
          });
          $('#word').show();
        }
      }
    },
    1000 - (screenId * 80)); // subject-side
    // 16 + (screenId * 5));
  }
  module.exit = function() {
    module.timeout.stop();
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
      .to("#color", (Math.random() * .2) + .5, {opacity:0, ease:Power2.easeIn})
      .repeat(-1);
  }
  return module;
};

// exit is just white on all screens
var ExitMode = function() {
  var module = new Mode();
  module.init = function(user) {
    if(screenId == 0) {
      $('body').append('<div class="fullscreen whitebg" id="color"><div class="centered"><div class="middle"><div class="inner"><span class="text" id="word">'+user.user+'</span></div></div></div></div>');
    } else {
      $('body').append('<div class="fullscreen whitebg" id="color"></div>');
    }
  };
  return module;
};

