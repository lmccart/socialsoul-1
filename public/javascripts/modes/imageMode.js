var ImageMode = function() {

  console.log('load imagemode ');

  var module = {};

  module.play = function() {
    console.log(module.dir);
    $('#test').html('ASSETS welcome '+module.user);
    for (var i=0; i<module.files.length; i++) {
      if (module.files[i].indexOf('.mp4') !== -1) { // append vine
        $('#test').append('<object data="'+module.dir+module.files[i]+'" >');
      } else { // append image
        $('#test').append('<img src="'+module.dir+module.files[i]+'" />');
      }
    }
    for (var i=0; i<module.tweets.length; i++) {
      console.log(module.tweets[i]);
      $('#test').append('<div class="tweet">'+module.tweets[i].text+'</div>');
    }
  };

  module.exit = function() {
    $('#test').empty();
  }

/*
  var container;

  var camera, scene, renderer;

  var uniforms, material, mesh;

  var mouseX = 0, mouseY = 0,
  lat = 0, lon = 0, phy = 0, theta = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;


  function init() {

    container = document.getElementById( 'container' );

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

    onWindowResize();

    window.addEventListener( 'resize', onWindowResize, false );

  }

  function onWindowResize( event ) {

    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;
    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  //

  function animate() {

    requestAnimationFrame( animate );

    render();

  }

  function render() {

    uniforms.time.value += 0.05;

    renderer.render( scene, camera );

  }
*/
  return module;
};

