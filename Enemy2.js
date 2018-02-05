// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Enemy2(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.enemy2;
    this.scale  = this.scale  || 1;

};

Enemy2.prototype = new Entity();

Enemy2.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

// Initial, inheritable, default values
Enemy2.prototype.cx = 450;
Enemy2.prototype.cy = 300;
Enemy2.prototype.xVel = 3;
Enemy2.prototype.yVel = 3;

Enemy2.prototype.rotation = 0;
Enemy2.prototype.launchVel = 2;
Enemy2.prototype.numSubSteps = 1;
Enemy2.prototype.movementSpeed = 2;
Enemy.prototype.lastCueTime = 0;
Enemy2.prototype.lives = 2;
Enemy2.prototype.sight = 200;
Enemy2.prototype.layer = 1;

Enemy2.prototype.update = function (du) {

  spatialManager.unregister(this);

  var newX = this.cx + this.xVel * du;
  var newY = this.cy + this.yVel * du;

  var hitEntity = this.findHitEntity();

  if(hitEntity === player){
    player.takeBulletHit();
  }

  if(newX > (g_canvas.width - (g_canvas.width - g_roomWidth)/2) ||
      newX < (g_canvas.width - g_roomWidth)/2 ||(hitEntity && hitEntity.layer != this.layer && (Math.abs(this.cy - hitEntity.cy)*1.1 <= this.getRadius() + hitEntity.getRadius()))){
        this.xVel *= -1;
  }
  if(newY > (g_canvas.height - (g_canvas.height - g_roomHeight)/2) ||
      newY < (g_canvas.height - g_roomHeight)/2 || (hitEntity && hitEntity.layer != this.layer && (Math.abs(this.cx - hitEntity.cx)*1.1 <= this.getRadius() + hitEntity.getRadius()))){
        this.yVel *= -1;
  }

  this.cx += this.xVel * du;
  this.cy += this.yVel * du;


  // Check if Enemy2 is dead, and if so remove it. Else re-register it
  if(this._isDeadNow) {
      return entityManager.KILL_ME_NOW;
  } else {
      spatialManager.register(this);
  }
};

// If enough time has passed since last cue, show cue
Enemy2.prototype.showCue = function(){
  var currTime = new Date().getTime();
  if(currTime - this.lastCueTime >= 4000){
    this.lastCueTime = currTime;
  }
  if(currTime - this.lastCueTime <= 200){
    g_ctx.fillStyle = 'green';
    g_ctx.font = '20px Ariel';
    g_ctx.fillText("Grrrr", this.cx - 25, this.cy);
  }
};


Enemy2.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Enemy2.prototype.takeBulletHit = function () {
  if(this.scale > 0.25){
    this._spawnFragments();
  }
  this.kill();
};

// When hit, spawn smaller versions of self, if not too small
Enemy2.prototype._spawnFragments = function () {
    entityManager._enemies.push(new Enemy2({
        cx : this.cx,
        cy : this.cy,
        xVel: -this.xVel*1.1,
        yVel: this.yVel*1.1,
        scale : this.scale /2
    }));
    entityManager._enemies.push(new Enemy2({
        cx : this.cx,
        cy : this.cy,
        xVel: this.xVel*1.1,
        yVel: -this.yVel*1.1,
        scale : this.scale /2
    }));
};

Enemy2.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;

    this.halt();
};


Enemy2.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
