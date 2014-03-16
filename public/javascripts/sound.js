function loaded() {
  console.log('loaded '+this._src);
}

var sounds;
if(screenId == 0) {
  sounds = {
    gong: new Howl({
      urls: ['../sound/gong.ogg'],
      onload: loaded
    }),
    swipe: new Howl({
      urls: ['../sound/swipe.ogg'],
      onload: loaded
    }),
    drone: new Howl({
      urls: ['../sound/drone.ogg'],
      loop: true,
      onload: loaded
    }),
    boop: new Howl({
      urls: ['../sound/boop.ogg'],
      onload: loaded
    }),

    beep433: new Howl({
      urls: ['../sound/beep433.ogg'],
      onload: loaded
    }),
    silenceglitch: new Howl({
      urls: ['../sound/silenceglitch.ogg'],
      onload: loaded
    }),

    texture0: new Howl({
      urls: ['../sound/texture0.ogg'],
      onload: loaded
    }),
    texture1: new Howl({
      urls: ['../sound/texture1.ogg'],
      onload: loaded
    }),
    texture2: new Howl({
      urls: ['../sound/texture2.ogg'],
      onload: loaded
    }),
    texture3: new Howl({
      urls: ['../sound/texture3.ogg'],
      onload: loaded
    }),
    texture4: new Howl({
      urls: ['../sound/texture4.ogg'],
      onload: loaded
    }),
    };
}