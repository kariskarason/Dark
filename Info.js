// ======
// Info
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// A generic contructor which accepts an arbitrary descriptor object
function Info(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite, if not otherwise specified
    this.sprite = g_sprites.info;

}

Info.prototype = new Entity();


// Initial, inheritable, default values
Info.prototype.cx = 200;
Info.prototype.cy = 200;
Info.prototype.layer = 7;
Info.prototype.content = '';
Info.prototype.active = false;
Info.prototype.activeTime = 0;

Info.prototype.update = function (du) {
    // Unregister
    spatialManager.unregister(this);

    // If info obect has been active for too long, no longer display
    var currTime = new Date().getTime();
    if(this.active && currTime - this.activeTime >= 5000){
      this.active = false;
    }
    spatialManager.register(this);

};

Info.prototype.getRadius = function () {
    return 15;
};

/*Info.prototype.InfoUsed = function () {
    player.Info(this.type);
    this.kill();
};*/

// Set the info as currently being displayed
Info.prototype.setActive =  function(){
  this.active = !this.active;
  this.activeTime = new Date().getTime();
}

Info.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    this.renderTextBox(ctx);
};

Info.prototype.renderTextBox = function(ctx){
  if(this.active){
    ctx.fillStyle = 'F8ECC2';
    ctx.strokeStyle = 'black';
    ctx.fillRect(g_canvas.width - 600, g_canvas.height - 300, 400, 250);
    ctx.strokeRect(g_canvas.width - 600, g_canvas.height - 300, 400, 250);
    ctx.fillStyle = 'black';
    ctx.fillText(this.content, g_canvas.width/3, 400);
  }
}
