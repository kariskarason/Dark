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
function Player(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.player;

};

Player.prototype = new Entity();

Player.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
    this.reset_movementSpeed = this.movementSpeed;
    this.reset_lives = this.lives;
    this.reset_currentHearts = this.currentHearts;
    this.reset_money = this.money;
    this.reset_bulletRange = this.bulletRange;
    this.reset_piercingBullets = this.piercingBullets;
    this.reset_bigBullets = this.bigBullets;
    this.reset_bulletTime = this.bulletTime;
    this.reset_itemCooldown = this.itemCooldown;
    this.reset_weapon = this.weapon;
    this.reset_lastTimeHit = this.lastTimeHit;
};

// Reset player
Player.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    this.movementSpeed = this.reset_movementSpeed;
    this.lives = this.reset_lives;
    this.currentHearts = this.reset_currentHearts;
    this.money = this.reset_money;
    this.bulletRange = this.reset_bulletRange;
    this.piercingBullets = this.reset_piercingBullets;
    this.bigBullets = this.reset_bigBullets;
    this.bulletTime = this.reset_bulletTime;
    this.itemCooldown = this.reset_itemCooldown;
    this.weapon = this.reset_weapon;
    this.lastTimeHit = this.reset_lastTimeHit;
};
// Movement and interaction keys
Player.prototype.KEY_UP = 'W'.charCodeAt(0);
Player.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
Player.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Player.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
Player.prototype.KEY_INTERACT = 'E'.charCodeAt(0);


// Initial, inheritable, default values
Player.prototype.cx = 450;
Player.prototype.cy = 300;
Player.prototype.rotation = 0;
Player.prototype.launchVel = 2;
Player.prototype.numSubSteps = 1;
Player.prototype.movementSpeed = 3;

Player.prototype.lives = 3;
Player.prototype.currentHearts = 3;

Player.prototype.money = 0;

Player.prototype.bulletRange = 750;
Player.prototype.piercingBullets = false;
Player.prototype.bigBullets = 0;
Player.prototype.bulletTime = false;

Player.prototype.itemCooldown = 0;

Player.prototype.lastTimeHit = 0;

Player.prototype.weapon = 'handgun';

Player.prototype.update = function (du) {

  spatialManager.unregister(this);

  var newX = this.cx;
  var newY = this.cy;

  // Calculate new coordinates based on movement
  if (keys[this.KEY_UP]) {
      newY -= this.movementSpeed;
  }
  if (keys[this.KEY_DOWN]) {
      newY += this.movementSpeed;
  }
  if (keys[this.KEY_LEFT]) {
      newX -= this.movementSpeed;
  }
  if (keys[this.KEY_RIGHT]) {
      newX += this.movementSpeed;
  }

  var hitEntity = this.findHitEntity();

  // Check if player will collide with anything on new cooridinates, if not: move player
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

  // Rotate the player to face where the mouse is pointing
  this.rotation = Math.atan2(player.cy - g_mouseY, player.cx - g_mouseX) + 270* (Math.PI / 180);

  // Check if the player is interaction with an object/door
  this.checkInteraction(this.cx, this.cy);

  // Re-register player
  spatialManager.register(this);

};

Player.prototype.checkInteraction = function (xCord, yCord) {
  // Check if an info object is in range, and if so: display it
  if (eatKey(this.KEY_INTERACT)) {
    var hitEntity = this.findHitEntity();
    if(hitEntity && hitEntity.layer === 7){
      hitEntity.setActive();
    }
    // Check if an upgrade object is in range, and if so: aquire it
    else if(hitEntity && hitEntity.layer === 8){
      // If the player has enough money for the upgrade, he gets it
      if(this.money >= hitEntity.price){
        hitEntity.upgradeUsed();
        this.money -= hitEntity.price;
      }
    }
    // Check if the player is by a door, and if room is cleared: go through it
    else if(entityManager._enemies.length === 0){
      // Room above
      if(g_currentRoom[0] - 1 >= 0){
        if(this.cx <= g_canvas.width/2 + g_doorRadius && this.cx >= g_canvas.width/2 - g_doorRadius && this.cy <= 0 + this.getRadius()*1.5 && g_roomArray[g_currentRoom[0]-1][g_currentRoom[1]][0] != 0){
          g_currentRoom[0]--;
          if(this.itemCooldown > 0){
            this.itemCooldown--;
          }
          entityManager.spawnRoom();
          this.cy = g_canvas.height - this.getRadius()*1.6;
        }
      }
      // Room below
      if(g_currentRoom[0] + 1 < g_roomArray.length){
        if(this.cx <= g_canvas.width/2 + g_doorRadius && this.cx >= g_canvas.width/2 - g_doorRadius && this.cy >= g_roomArray[g_currentRoom[0]][g_currentRoom[1]][0] - this.getRadius()*1.5 && g_roomArray[g_currentRoom[0]+1][g_currentRoom[1]][0] != 0){
          g_currentRoom[0]++;
          if(this.itemCooldown > 0){
            this.itemCooldown--;
          }
          entityManager.spawnRoom();
          this.cy = this.getRadius()*1.6;
        }
      }
      // Room to the left
      if(g_currentRoom[1] - 1 >= 0){
        if(this.cx <= (g_canvas.width - g_roomWidth)/2 + this.getRadius()*1.5
        && this.cy <= (g_canvas.height)/2 + g_doorRadius
        && this.cy >= (g_canvas.height)/2 - g_doorRadius
        && g_roomArray[g_currentRoom[0]][g_currentRoom[1]-1][0] != 0){
          g_currentRoom[1]--;
          if(this.itemCooldown > 0){
            this.itemCooldown--;
          }
          entityManager.spawnRoom();
          this.cx = g_canvas.width - (g_canvas.width - g_roomWidth)/2 - this.getRadius()*1.6;
        }
      }
      // Room to the right
      if(g_currentRoom[1] + 1 < g_roomArray[g_currentRoom[0]].length){
        if(this.cx >= (g_canvas.width - (g_canvas.width - g_roomWidth)/2) - this.getRadius()*1.5
        && this.cy <= (g_canvas.height)/2 + g_doorRadius
        && this.cy >= (g_canvas.height)/2 - g_doorRadius
        && g_roomArray[g_currentRoom[0]][g_currentRoom[1]+1][0] != 0){
          g_currentRoom[1]++;
          if(this.itemCooldown > 0){
            this.itemCooldown--;
          }
          entityManager.spawnRoom();
          this.cx = (g_canvas.width - g_roomWidth)/2 + this.getRadius()*1.6
        }
      }
    }
  }
}
// Fires a player bullet
Player.prototype.fireBullet = function(){
  // Values used for calculating values for bullets
  var dX = +Math.sin(this.rotation);
  var dY = -Math.cos(this.rotation);
  var dXSkew = +Math.sin(this.rotation*1.05);
  var dYSkew = -Math.cos(this.rotation*1.05);
  var dXSkew2 = +Math.sin(this.rotation/1.05);
  var dYSkew2 = -Math.cos(this.rotation/1.05);
  var launchDist = this.getRadius() * 1.2;

  var relVel = this.launchVel;
  var relVelX = dX * relVel;
  var relVelY = dY * relVel;
  // Fire shot/shots depending on type of weapon
  if(this.weapon === 'handgun' || this.weapon === 'submachineGun'){
    entityManager.fireBullet(
       this.cx+ dX * launchDist, this.cy+ dY * launchDist,
       relVelX*2, relVelY*2,
       this.rotation, 0, this.bulletRange / NOMINAL_UPDATE_INTERVAL);
    audioplayer.playClip(0);
  }
  else if(this.weapon === 'shotgun'){
    entityManager.fireBullet(
       this.cx+ dX * launchDist, this.cy+ dY * launchDist,
       relVelX*2, relVelY*2,
       this.rotation, 0, this.bulletRange / NOMINAL_UPDATE_INTERVAL);
    entityManager.fireBullet(
      this.cx+ dX * launchDist, this.cy+ dY * launchDist,
      dXSkew * relVel*2, dYSkew * relVel*2,
      this.rotation*1.1, 0, this.bulletRange / NOMINAL_UPDATE_INTERVAL);
    entityManager.fireBullet(
     this.cx+ dX * launchDist, this.cy+ dY * launchDist,
     dXSkew2 * relVel*2, dYSkew2 * relVel*2,
     this.rotation/1.1, 0, this.bulletRange / NOMINAL_UPDATE_INTERVAL);
  }

};

Player.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

// Player takes a hit, possibly dying, triggering a game over
Player.prototype.takeBulletHit = function () {
  var currentTime = new Date().getTime();
  if(currentTime - this.lastTimeHit >= 750){
    this.currentHearts -= 0.5;
    if(this.currentHearts <= 0){
      this.gameOver();
    }
    this.lastTimeHit = currentTime;
    audioplayer.playClip(4);
  }

};

// Tell the entityManager to reset the game
Player.prototype.gameOver = function(){
  entityManager.reset();
};

// Power up the player based on aquired powerup
Player.prototype.powerup = function (stat) {
  if(stat === 0){
    if(this.currentHearts < this.lives){
      this.currentHearts = Math.min(this.currentHearts + 0.5, this.lives);
    }
  }
  if(stat === 1){
    if(this.currentHearts < this.lives){
      this.currentHearts = Math.min(this.currentHearts + 1, this.lives);
    }
  }
  if(stat === 2){
    this.money += 1;
  }
  if(stat === 3){
    this.money += 5;
  }
  if(stat === 4){
    this.money += 10;
  }
}

// Upgrade the player based on the aquired upgrade
Player.prototype.upgrade = function(type){
  if(type === 0){
    this.weapon = 'shotgun';
    this.bulletRange /= 1.2;
  }
  if(type === 1){
    this.weapon = 'submachineGun';

  }
  if(type === 2){
    this.bulletTime = true;
    this.itemCooldown = 0;
  }
  if(type === 3){
    this.piercingBullets = true;
  }
  if(type === 4){
    this.lives += 1;
    this.currentHearts += 1;
  }
  if(type === 5){
    this.bigBullets += 1;
  }
}

// PLayer rendering, with some other renders in between to ensure proper placement
// with regards to the darkness
Player.prototype.render = function (ctx) {
    ctx.save();
    if(g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].darkness){
      ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
    }
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'red';
    var g_roomWidth = g_roomArray[g_currentRoom[0]][g_currentRoom[1]][1];
    var g_roomHeight = g_roomArray[g_currentRoom[0]][g_currentRoom[1]][0];
    if(g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].darkness){
      ctx.fillRect((g_canvas.width - g_roomWidth)/2, (g_canvas.height - g_roomHeight)/2, g_roomWidth, g_roomHeight);
      ctx.strokeRect((g_canvas.width - g_roomWidth)/2, (g_canvas.height - g_roomHeight)/2, g_roomWidth, g_roomHeight);
      entityManager.enemyCues();
      entityManager.renderHUD(ctx);
      entityManager.renderInfo(ctx);
    }

    ctx.fillStyle = 'black';
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, this.rotation);

    if(g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].darkness){
      ctx.translate(this.cx,this.cy);
      ctx.rotate(this.rotation);
      ctx.translate(-this.cx,-this.cy);
      ctx.beginPath();
      ctx.moveTo(this.cx-5,this.cy-this.getRadius());
      ctx.lineTo(this.cx+5,this.cy-this.getRadius());
      ctx.lineTo(this.cx+40, this.cy-120);
      ctx.lineTo(this.cx-40,this.cy-120);
      ctx.lineTo(this.cx-5,this.cy-this.getRadius());
      ctx.restore();
      ctx.save();

      ctx.clip();
    }
};
