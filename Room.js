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
function Room(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.Room;

};

Room.prototype = new Entity();

Room.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

// Initial, inheritable, default values
Room.prototype.width = 500;
Room.prototype.height = 500;
Room.prototype.enemies = [];
Room.prototype.boxes = [];
Room.prototype.infos = [];
Room.prototype.upgrades = [];
Room.prototype.bosses = [];
Room.prototype.darkness = false;


/*Room.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;

    this.halt();
};

Room.prototype.render = function (ctx) {
  g_sprites.Room.drawCentredAt(
      ctx, this.cx, this.cy, this.rotation
  );
};*/
