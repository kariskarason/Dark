// ==========
// BOSS STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Boss(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    this.lastBarfTime = new Date().getTime();
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.bossHead;

};

Boss.prototype = new Entity();

Boss.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

// Initial, inheritable, default values
Boss.prototype.cx = 450;
Boss.prototype.cy = 300;
Boss.prototype.rotation = 0;
Boss.prototype.launchVel = 2;
Boss.prototype.numSubSteps = 1;
Boss.prototype.lives = 100;
Boss.prototype.sight = 1000;
Boss.prototype.attackRange = 20;
Boss.prototype.lastHitTime = 0;
Boss.prototype.lastBarfTime = 0;
Boss.prototype.hitCount = 30;
Boss.prototype.lastCueTime = 0;
Boss.prototype.attackRate = 0.01;
Boss.prototype.bulletRange = 5000;
Boss.prototype.layer = 1;

Boss.prototype.update = function (du) {

  spatialManager.unregister(this);

  var distToPlayer = Math.sqrt(((this.cx - player.cx)**2 + (this.cy - player.cy)**2));
  var currTime = new Date().getTime();

  this.rotation = Math.atan2(this.cy - player.cy, this.cx - player.cx) + 270* (Math.PI / 180);

  if(currTime - this.lastHitTime >= this.attackRate * 1000 && (this.hitCount > 0)){
    var dX = +Math.sin(this.rotation);
    var dY = -Math.cos(this.rotation);
    var launchDist = this.getRadius() * 1.2;

    var relVel = this.launchVel;
    var relVelX = dX * relVel;
    var relVelY = dY * relVel;

    entityManager.fireBullet(
       this.cx+ dX * launchDist, this.cy+ dY * launchDist,
       relVelX*2, relVelY*2,
       this.rotation, 1, this.bulletRange / NOMINAL_UPDATE_INTERVAL);
    audioplayer.playClip(5);
    this.lastHitTime = currTime;
    this.hitCount--;
    this.lastBarfTime = currTime;
  }
  if(currTime - this.lastBarfTime >= 1200){
    this.hitCount = 30;
  }

  // Check if Boss is dead, and if so remove it. Else re-register it
  if(this._isDeadNow) {
      return entityManager.KILL_ME_NOW;
  } else {
      spatialManager.register(this);
  }
};

Boss.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Boss.prototype.takeBulletHit = function () {
  this.lives--;
  if(this.lives <= 0){
    this.kill();
  }
};

Boss.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;

    this.halt();
};

Boss.prototype.render = function (ctx) {
  g_sprites.bossHead.drawCentredAt(
      ctx, this.cx, this.cy, this.rotation
  );
};
