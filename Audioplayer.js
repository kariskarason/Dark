// Playin audiofiles for soundeffects

var audioplayer = {
    sounds: [new Audio('sounds/shot.wav'), new Audio('sounds/boxHit.wav'),
    new Audio('sounds/mainSong.wav'), new Audio('sounds/pickup.wav'),
    new Audio('sounds/playerHit.wav'), new Audio('sounds/enemyShot.wav'),
    new Audio('sounds/upgrade.wav')],

    songs: [new Audio('sounds/mainSong.wav'), new Audio('sounds/bossSong.wav'), new Audio('sounds/bossSong.wav')],
    currentSong: 0,

    muted: false
};
var KEY_MUTE = 'M'.charCodeAt(0);

// Mute/unmute sound if M is pressed
audioplayer.update = function(){
  if (eatKey(KEY_MUTE)) {
      this.muted = !this.muted;
      if(this.muted) this.stopSong();
      else this.startSong();
  }
};
// Play requested clip if not muted
audioplayer.playClip = function(clipNr){
  if(!this.muted){
    this.sounds[clipNr].cloneNode(true).play();
  }

};

// Change what song is being player
audioplayer.updateSong = function(songNr){
  this.stopSong();
  this.currentSong = songNr;
  this.startSong();
}

// Stop song from playing
audioplayer.stopSong = function(){
  audioplayer.songs[audioplayer.currentSong].pause();
  audioplayer.songs[audioplayer.currentSong].currentTime = 0;
};

// Start song
audioplayer.startSong = function(){
  if(!this.muted){
    audioplayer.songs[audioplayer.currentSong].addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    audioplayer.songs[audioplayer.currentSong].play();
  }
};
