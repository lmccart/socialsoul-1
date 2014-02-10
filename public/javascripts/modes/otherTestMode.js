

var OtherTestMode = function() {
  console.log('load testmode ');


  var module = {};
  
  module.play = function(data) {
    init();
    animate();
  }

  module.exit = function() {
    $('#container').empty();
    // pend this is not sufficient cleanup
  }

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

  return module;
};
