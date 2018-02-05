// ==========
// ENEMY STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Enemy(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.enemy;

};

Enemy.prototype = new Entity();

Enemy.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

// Initial, inheritable, default values
Enemy.prototype.cx = 450;
Enemy.prototype.cy = 300;
Enemy.prototype.rotation = 0;
Enemy.prototype.launchVel = 2;
Enemy.prototype.numSubSteps = 1;
Enemy.prototype.movementSpeed = 2;
Enemy.prototype.lives = 2;
Enemy.prototype.sight = 200;
Enemy.prototype.attackRange = 20;
Enemy.prototype.lastHitTime = 0;
Enemy.prototype.lastCueTime = 0;
Enemy.prototype.attackRate = 1;
Enemy.prototype.bulletRange = 850;
Enemy.prototype.layer = 1;
Enemy.prototype.melee = false;

Enemy.prototype.update = function (du) {

  spatialManager.unregister(this);

  var distToPlayer = Math.sqrt(((this.cx - player.cx)**2 + (this.cy - player.cy)**2));
  var currTime = new Date().getTime();



  // Move towards player if he is in range
  if(distToPlayer <= this.sight && distToPlayer >= player.getRadius() + this.getRadius()){
    this.rotation = Math.atan2(this.cy - player.cy, this.cx - player.cx) + 270* (Math.PI / 180);

    var xDist = this.cx - player.cx;
    var yDist = this.cy - player.cy;

    var xRatio = xDist / (Math.abs(xDist) + Math.abs(yDist));
    var yRatio = yDist / (Math.abs(xDist) + Math.abs(yDist));

    var hitEntity = this.findHitEntity();

    var newX = this.cx - xRatio * (this.movementSpeed*du);
    var newY = this.cy - yRatio * (this.movementSpeed*du);

    // Check if new locations collide with anything
    if(newX + this.getRadius() <= (g_canvas.width - g_roomWidth)/2 + g_roomWidth && newX - this.getRadius() >= (g_canvas.width - g_roomWidth)/2){
      if(hitEntity && (Math.abs(this.cy - hitEntity.cy)*1.1 <= this.getRadius() + hitEntity.getRadius())){
        if(newX > this.cx){
          if(hitEntity.cx <= this.cx){
            this.cx = newX;
          }
        }
        else if(newX < this.cx){
          if(hitEntity.cx  >= this.cx){
            this.cx = newX;
          }
        }
      }
      else{
        this.cx = newX;
      }


    }
    if(newY + this.getRadius() <= (g_canvas.height - g_roomHeight)/2 + g_roomHeight && newY - this.getRadius() >= (g_canvas.height - g_roomHeight)/2){
      if(hitEntity && (Math.abs(this.cx - hitEntity.cx)*1.1 <= this.getRadius() + hitEntity.getRadius())){
        if(newY >= this.cy){
          if(hitEntity.cy <= this.cy)
            this.cy = newY;
        }
        else if(newY < this.cy){
          if(hitEntity.cy >= this.cy){
            this.cy = newY;
          }
        }
      }
      else{
        this.cy = newY;
      }
    }

  }
  // Check for melee attack if enemy is a melee attacker
  if(this.melee){
    // Attack player if he is in range
    if(distToPlayer <= this.getRadius() + this.attackRange){
      if(currTime - this.lastHitTime >= this.attackRate * 1000){
        player.takeBulletHit();
        this.lastHitTime = currTime;
      }

    }
  }
  // Else, check for a ranged attack
  else if(distToPlayer < this.sight && currTime - this.lastHitTime >= this.attackRate * 1000){
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
  }


  // Check if enemy is dead, and if so remove it. Else re-register it
  if(this._isDeadNow) {
      return entityManager.KILL_ME_NOW;
  } else {
      spatialManager.register(this);
  }
};
// If enough time has passed since last cue, show cue
Enemy.prototype.showCue = function(){
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


Enemy.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Enemy.prototype.takeBulletHit = function () {
  this.lives--;
  if(this.lives <= 0){
    this.kill();
  }
};

Enemy.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;

    this.halt();
};


Enemy.prototype.render = function (ctx) {
  g_sprites.enemy.drawCentredAt(
      ctx, this.cx, this.cy, this.rotation
  );
};
