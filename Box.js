// ====
// Box
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
var powerupLikelihood = 0.5;

// A generic contructor which accepts an arbitrary descriptor object
function Box(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.box1;

};

Box.prototype = new Entity();

Box.prototype.cx = 450;
Box.prototype.cy = 300;
Box.prototype.rotation = 0;
Box.prototype.lives = 3;
Box.prototype.layer = 2;

/*
Box.prototype.randomisePosition = function () {
    // Box randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || Math.random() * g_canvas.width;
    this.cy = this.cy || Math.random() * g_canvas.height;
    this.rotation = this.rotation || 0;
};*/

Box.prototype.update = function (du) {
    // Unregister
    spatialManager.unregister(this);

    // Check if dead, if not: re-register
    if(this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    } else {
        spatialManager.register(this);
    }
};

Box.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 1.2;
};

// Take hit, if destroyed: possibly drop powerup
Box.prototype.takeBulletHit = function () {
    audioplayer.playClip(1);
    if(this.lives === 3){
      this.lives--;
      this.sprite = g_sprites.box2;
    }
    else if(this.lives === 2){
      this.lives--;
      this.sprite = g_sprites.box3;
    }
    else if(this.lives === 1){
      if(Math.random() <= powerupLikelihood){
        entityManager.spawnPowerup(this.cx, this.cy, 3);
      }
      this.kill();
    }
};

Player.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};


Box.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
