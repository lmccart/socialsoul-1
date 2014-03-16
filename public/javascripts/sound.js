function loaded() {
  console.log('loaded '+this._src);
}

var sounds = {
  boop: new Howl({
    urls: ['../sound/boop.ogg'],
    onload: loaded
  }),
};
if(screenId == 0) {
 sounds.gong = new Howl({
    urls: ['../sound/gong.ogg'],
    onload: loaded
  });
  sounds.swipe = new Howl({
    urls: ['../sound/swipe.ogg'],
    onload: loaded
  });
  sounds.drone = new Howl({
    urls: ['../sound/drone.ogg'],
    loop: true,
    onload: loaded
  });

  sounds.beep433 = new Howl({
    urls: ['../sound/beep433.ogg'],
    onload: loaded
  });
  sounds.silenceglitch = new Howl({
    urls: ['../sound/silenceglitch.ogg'],
    onload: loaded
  });

  sounds.texture0 = new Howl({
    urls: ['../sound/texture0.ogg'],
    onload: loaded
  });
  sounds.texture1 = new Howl({
    urls: ['../sound/texture1.ogg'],
    onload: loaded
  });
  sounds.texture2 = new Howl({
    urls: ['../sound/texture2.ogg'],
    onload: loaded
  });
  sounds.texture3 = new Howl({
    urls: ['../sound/texture3.ogg'],
    onload: loaded
  });
  sounds.texture4 = new Howl({
    urls: ['../sound/texture4.ogg'],
    onload: loaded
  });
}