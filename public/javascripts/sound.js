function loaded() {
  console.log('loaded '+this._src);
}

var sounds = {
  mix: new Howl({
    urls: ['../sound/socialsoul-mix.ogg'],
    onload: loaded
  }),
};
