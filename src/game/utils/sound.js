/**
     * A simple wrapper for short Audio playback, used to play 
     * FX sounds such as the sound played when you hit the wall.
     * @param {String} path   URL / relative path to sound file.
     * @param {Number} volume A volume level between 0 and 1, defaults to 1
     */
export default class Sound {
    constructor(path, volume) {
    var that = this;

    this.path         = path;
    this.audio        = new Audio();
    this.audio.src    = path;
    this.audio.loop   = false;
    this.audio.volume = volume || 1;
    this.ready        = false;

    this.audio.addEventListener('canplay', function() {
      that.ready = true;
    });
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    if(this.ready) {
      this.audio.currentTime = 0;
      this.pause();
    }
  }

  play() {
    var that = this;
    if(this.audio.playing) {
      this.stop();
      this.audio.currentTime = 0;
    }
    this.audio.play();

  }
}