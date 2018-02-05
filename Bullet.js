// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
}

Bullet.prototype = new Entity();


// Initial, inheritable, default values
Bullet.prototype.rotation = 0;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 1;
Bullet.prototype.velY = 1;
Bullet.prototype.playerBullet = true;

// Convert times from milliseconds to "nominal" time units.
Bullet.prototype.lifeSpan = 750 / NOMINAL_UPDATE_INTERVAL;

Bullet.prototype.update = function (du) {
    // Unregister
    spatialManager.unregister(this);

    // Check if lifespan is over, if so: die
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    // IF out of bounds of room: die
    if(this.cx < (g_canvas.width - g_roomWidth)/2 || this.cx > (g_canvas.width - g_roomWidth)/2 + g_roomWidth){
      return entityManager.KILL_ME_NOW;
    }
    if(this.cy < (g_canvas.height - g_roomHeight)/2 || this.cy > (g_canvas.height - g_roomHeight)/2 + g_roomHeight){
      return entityManager.KILL_ME_NOW;
    }

    // Check for hit, if not on same layer: hit entity
    var hitEntity = this.findHitEntity();
    if (hitEntity && this.layer != hitEntity.layer) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) canTakeHit.call(hitEntity);
        if(this.layer === 1 || (this.layer === 0 && !player.piercingBullets)){
          return entityManager.KILL_ME_NOW;
        }
    }

    // Re-register
    spatialManager.register(this);

};

Bullet.prototype.getRadius = function () {
    return 4;
};

Bullet.prototype.render = function (ctx) {
    // If player has big bullets, render the bullets bigger
    if(this.layer === 0 && player.bigBullets > 0){
      g_sprites.bullet.scale = 1 + (0.20 * player.bigBullets);
    }
    if(this.layer === 0){
      g_sprites.bullet.drawCentredAt(
          ctx, this.cx, this.cy, this.rotation
      );
    }
    else{
      g_sprites.enemyBullet.drawCentredAt(
          ctx, this.cx, this.cy, this.rotation
      );
    }

    g_sprites.bullet.scale = 0.5;
};
