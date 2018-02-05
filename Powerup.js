// ======
// Powerup
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// Used for randomly choosing powerups with a certain percentage
var weightedPowerups;
var totalPowerupWeight;

// A generic contructor which accepts an arbitrary descriptor object
function Powerup(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Pick a type for the powerup
    var randPowerup = Math.floor(Math.random() * totalPowerupWeight);
    this.type = weightedPowerups[randPowerup];

    this.sprite = powerupSprites[this.type];

}

Powerup.prototype = new Entity();


// Initial, inheritable, default values
Powerup.prototype.cx = 200;
Powerup.prototype.cy = 200;

Powerup.prototype.update = function (du) {
    // Unregister
    spatialManager.unregister(this);

    // Check if the player is in range, and power him up if so
    var hitEntity = this.findHitEntity();
    if (hitEntity === player) {
      this.powerupUsed();
    }

    // If the powerup is still active, re-register, else kill
    if(this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    } else {
        spatialManager.register(this);
    }
};

Powerup.prototype.getRadius = function () {
    return 4;
};

// A function that handles the powerup being used on the player
Powerup.prototype.powerupUsed = function () {
    audioplayer.playClip(3);
    player.powerup(this.type);
    this.kill();
};

Powerup.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
