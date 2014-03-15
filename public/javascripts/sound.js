var soundEffects = new Howl({
  urls: ['../sound/soundEffects.wav'],
  sprite: {
    gong: [0, 11458],
    swipe: [11458, 1639],
    drone: [13219, 34658],
    noise: [48343, 6235],
    silence: [54536, 8249]
  },
  onload: function() {
  	console.log('loaded sound effects');
  }
});