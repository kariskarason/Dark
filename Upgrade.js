// ======
// Upgrade
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
// Variables for randomly picking upgrades with a weight
var weightedUpgrades;
var totalUpgradeWeight;
var upgradePer = [20, 20, 10, 15, 20, 15];

// A generic contructor which accepts an arbitrary descriptor object
function Upgrade(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    var randUpgrade = Math.floor(Math.random() * totalUpgradeWeight);
    this.type = weightedUpgrades[randUpgrade];
    if(this.type != 4 && this.type != 5){
      upgradePer[this.type] = 0;
      entityManager.initializeUpgrades();
    }

    this.sprite = upgradeSprites[this.type];
}

Upgrade.prototype = new Entity();


// Initial, inheritable, default values
Upgrade.prototype.cx = 200;
Upgrade.prototype.cy = 200;
Upgrade.prototype.price = 0;
Upgrade.prototype.layer = 8;

Upgrade.prototype.update = function (du) {
    // Unregister
    spatialManager.unregister(this);

    var hitEntity = this.findHitEntity();
    if(this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    } else {
        spatialManager.register(this);
    }

};

Upgrade.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

// Upgrade player
Upgrade.prototype.upgradeUsed = function () {
    player.upgrade(this.type);
    audioplayer.playClip(6);
    this.kill();
};

Upgrade.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    if(this.price > 0){
      ctx.fillText(this.price + '$', this.cx - 12.5, this.cy - this.getRadius()*0.9);
    }
};
