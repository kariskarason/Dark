/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA
_bullets: [],
_enemies: [],
_boxes: [],
_powerups: [],
_upgrades: [],
_info: [],
_onMenu: true,
_onInstructions: false,

// "PRIVATE" METHODS

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._bullets, this._enemies, this._boxes, this._powerups, this._upgrades, this._info];
},

init: function() {

},
// Resets on game over
reset: function(){
  player.reset();
  g_currentRoom = g_startingRoom;
  g_roomDetails = [];
  this.initRooms();
  this.spawnRoom();
  this.initializeUpgrades();
  this.initializePowerups();
  this.placeUpgrades();
  this.placeInfo();
  this._onMenu = true;
},

fireBullet: function(cx, cy, velX, velY, rotation, layer, bulletRange) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,

        rotation : rotation,

        layer : layer,
        lifeSpan : bulletRange
    }));
},

spawnEnemy: function(cx, cy, rotation) {
    this._enemies.push(new Enemy({
        cx   : cx,
        cy   : cy,

        rotation : rotation
    }));
},
// Spawns enemy in a random location within a given room
spawnRandomEnemy: function(i,j, isDark) {
    var roomWidth = g_roomArray[i][j][1];
    var roomHeight = g_roomArray[i][j][0];

    var sight = Math.floor(Math.random() * 75) + 200;
    var yCord;
    var xCord;


    if(roomWidth != 100){
      xCord = Math.floor(Math.random() * (roomWidth - 3*sight)) + (g_canvas.width - roomWidth)/2 + 1.5*sight;
    }
    else{
      xCord = Math.floor(Math.random() * (roomWidth - 42)) + (g_canvas.width - roomWidth)/2 + 21;
    }

    if(roomHeight != 100){
      yCord = Math.floor(Math.random() * (roomHeight - 3*sight)) + (g_canvas.height - roomHeight)/2 + 1.5*sight
    }
    else{
      yCord = Math.floor(Math.random() * roomHeight) + (g_canvas.height - roomHeight)/2;
    }

    if(isDark){
      var enemy = new Enemy({
          cx   : xCord,
          cy   : yCord,
          sight: sight,
          lastCueTime: new Date().getTime() - (2000 + (Math.floor(Math.random() * 5) * 1000)),
          melee: true,
          movementSpeed: 3,
          rotation : 0
      });
      return enemy;
    }
    else if(Math.random() < 0.5){
      var enemy = new Enemy({
          cx   : xCord,
          cy   : yCord,
          sight: sight,
          lastCueTime: new Date().getTime() - (2000 + (Math.floor(Math.random() * 5) * 1000)),

          rotation : 0
      });
      return enemy;
    }
    else{
      var enemy = new Enemy2({
          cx   : xCord,
          cy   : yCord,
          sight: sight,
          lastCueTime: new Date().getTime() - (2000 + (Math.floor(Math.random() * 5) * 1000)),

          rotation : 0
      });
      return enemy;
    }
},
// Displays cues of enemy location in the dark
enemyCues: function(){
  for(var i = 0; i < this._enemies.length; i++){
    this._enemies[i].showCue();
  }
},
// Sets details about room at start, and stores them
initRooms: function(){
  for(var i = 0; i < g_roomArray.length; i++){
    var linelength = g_roomArray[i].length;
    var line = []
    for(var j = 0; j < linelength; j++){
      if(g_roomArray[i][j][0] != 0){
        var room = this.randomRoom(i, j);
        line.push(room);
      }
      else{
        line.push(0);
      }
    }
    g_roomDetails.push(line);
  }
  this.setSpecialRooms();
},
// Generates enemies and boxes for a given room location
randomRoom: function(i, j){
  var enemyArray = [];
  var boxArray = [];

  var isDark = Math.random() <= 0.33;
  if(g_roomArray[i][j][1] === 800){
    if(i != g_currentRoom[0] || j != g_currentRoom[1]){
      var randEnemyCount = Math.floor(Math.random() * 3);
      for(var k = 0; k < randEnemyCount; k++){
        var enemy = this.spawnRandomEnemy(i,j, isDark);
        enemyArray.push(enemy);
      }
    }
    var randBoxCount = Math.floor(Math.random() * 5);
    for(var l = 0; l < randBoxCount; l++){
      var boxX = (g_canvas.width - g_roomArray[i][j][1])/2 + 21 + Math.floor(Math.random() * (Math.floor(g_roomArray[i][j][1]/42))) * 42;
      var boxY = (g_canvas.height - g_roomArray[i][j][0])/2 + 21 + Math.floor(Math.random() * (Math.floor(g_roomArray[i][j][0]/42))) * 42;
      while((boxX <= g_roomArray[i][j][1]/2 + g_doorRadius && boxX >= g_roomArray[i][j][1]/2 - g_doorRadius) || (boxY <= g_roomArray[i][j][0]/2 + g_doorRadius && boxY >= g_roomArray[i][j][0]/2 - g_doorRadius)){
        boxX = (g_canvas.width - g_roomArray[i][j][1])/2 + 21 + Math.floor(Math.random() * (Math.floor(g_roomArray[i][j][1]/42))) * 42;
        boxY = (g_canvas.height - g_roomArray[i][j][0])/2 + 21 + Math.floor(Math.random() * (Math.floor(g_roomArray[i][j][0]/42))) * 42;
      }
      var box = this.createBox(boxX, boxY);
      boxArray.push(box);
    }
  }

  if(g_roomArray[i][j][0] === 600){
    if(i != g_currentRoom[0] || j != g_currentRoom[1]){
      var randEnemyCount = Math.floor(Math.random() * 3);
      for(var k = 0; k < randEnemyCount; k++){
        var enemy = this.spawnRandomEnemy(i,j, isDark);
        enemyArray.push(enemy);
      }
    }
    var randBoxCount = Math.floor(Math.random() * 5);
    for(var l = 0; l < randBoxCount; l++){
      var boxX = (g_canvas.width - g_roomArray[i][j][1])/2 + 21 + Math.floor(Math.random() * (Math.floor(g_roomArray[i][j][1]/42))) * 42;
      var boxY = (g_canvas.height - g_roomArray[i][j][0])/2 + 21 + Math.floor(Math.random() * (Math.floor(g_roomArray[i][j][0]/42))) * 42;
      while((boxX <= g_roomArray[i][j][1]/2 + g_doorRadius && boxX >= g_roomArray[i][j][1]/2 - g_doorRadius) || (boxY <= g_roomArray[i][j][0]/2 + g_doorRadius && boxY >= g_roomArray[i][j][0]/2 - g_doorRadius)){
        boxX = (g_canvas.width - g_roomArray[i][j][1])/2 + 21 + Math.floor(Math.random() * (Math.floor(g_roomArray[i][j][1]/42))) * 42;
        boxY = (g_canvas.height - g_roomArray[i][j][0])/2 + 21 + Math.floor(Math.random() * (Math.floor(g_roomArray[i][j][0]/42))) * 42;
      }
      var box = this.createBox(boxX, boxY);
      boxArray.push(box);
    }
  }


  var room = new Room({
    width: g_roomArray[i][j][1],
    height: g_roomArray[i][j][0],
    enemies: enemyArray,
    boxes: boxArray,
    infos: [],
    upgrades: [],
    darkness: isDark,
  });
  return room;
},
// Special configurations for beginning room and boss room
setSpecialRooms: function(){
  g_roomDetails[g_startingRoom[0]][g_startingRoom[1]].darkness = false;
  g_roomDetails[0][2].darkness = false;

  var boss = new Boss({
    cx: 625,
    cy: 275
  });
  g_roomDetails[0][2].enemies = [];
  g_roomDetails[0][2].enemies.push(boss);
},
// Spawns the entities for a newly entered room
spawnRoom: function(){
  // Clear the entities of the previous room
  for(var i = 0; i < this._enemies.length; i++){
    spatialManager.unregister(this._enemies[i]);
  }
  for(var i = 0; i < this._bullets.length; i++){
    spatialManager.unregister(this._bullets[i]);
  }
  for(var i = 0; i < this._boxes.length; i++){
    spatialManager.unregister(this._boxes[i]);
  }
  for(var i = 0; i < this._powerups.length; i++){
    spatialManager.unregister(this._powerups[i]);
  }
  for(var i = 0; i < this._upgrades.length; i++){
    spatialManager.unregister(this._upgrades[i]);
  }
  for(var i = 0; i < this._info.length; i++){
    spatialManager.unregister(this._info[i]);
  }

  this._enemies.splice(0, this._enemies.length);
  this._bullets.splice(0, this._bullets.length);
  this._boxes.splice(0, this._boxes.length);
  this._powerups.splice(0, this._powerups.length);
  this._upgrades.splice(0, this._upgrades.length);
  this._info.splice(0, this._info.length);

  // Add the entities of the new room
  for(var i = 0; i < g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].enemies.length; i++){
    if(!g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].enemies[i]._isDeadNow){
      this._enemies.push((g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].enemies[i]));
    }

  }

  for(var i = 0; i < g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].boxes.length; i++){
    this._boxes.push((g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].boxes[i]));
  }

  for(var i = 0; i < g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].upgrades.length; i++){
    this._upgrades.push((g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].upgrades[i]));
  }

  for(var i = 0; i < g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].infos.length; i++){
    this._info.push((g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].infos[i]));
  }

  g_roomWidth = g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].width;
  g_roomHeight = g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].height;

  // If the new room is the boss room, play boss music, else main song
  if(g_currentRoom[0] === 0 && g_currentRoom[1] === 2){
    audioplayer.updateSong(2);
  }
  else if(audioplayer.currentSong != 0){
    audioplayer.updateSong(0);
  }
},

createBox: function(cx, cy){
  var box =new Box({
    cx: cx,
    cy: cy
  });
  return box;
},
// Spawns a new powerup at a given location
spawnPowerup: function(cx, cy, type){
  this._powerups.push(new Powerup({
    cx: cx,
    cy: cy,
    type: type,
    sprite: powerupSprites[type]
  }));
},
// Sets the probability array for picking powerups later on
initializePowerups: function(){
  var powerups = [0,1,2,3,4];
  var powerupPer = [25, 15, 40, 15, 5];
  totalPowerupWeight = eval(powerupPer.join("+"));
  weightedPowerups = [];
  var currentPowerup = 0;

  while (currentPowerup < powerups.length){
      for (var i = 0; i < powerupPer[currentPowerup]; i++){
          weightedPowerups[weightedPowerups.length] = powerups[currentPowerup];
      }
      currentPowerup++;
  }
},
// Sets the probability array for picking upgrades later on
initializeUpgrades: function(){
  var upgrades = [0, 1, 2, 3, 4, 5];
  totalUpgradeWeight = eval(upgradePer.join("+"));
  weightedUpgrades = [];
  var currentUpgrade = 0;

  while (currentUpgrade < upgrades.length){
      for (var i = 0; i < upgradePer[currentUpgrade]; i++){
          weightedUpgrades[weightedUpgrades.length] = upgrades[currentUpgrade];
      }
      currentUpgrade++;
  }
},
// Places info objects at designated locations
placeInfo: function(){
  var info = new Info({
    cx: g_canvas.width - 35,
    cy: g_canvas.width/2,
    content: "So turn around and smile :)"
  });
  g_roomDetails[2][3].infos.push(info);

},
// Places upgrades in treasure and store rooms
placeUpgrades: function(){
  var upgrade = new Upgrade({
    cx: 70,
    cy: 300
  });
  g_roomDetails[2][0].upgrades.push(upgrade);

  var upgrade2 = new Upgrade({
    cx: 410,
    cy: 100,
    price: 10
  });
  var upgrade3 = new Upgrade({
    cx: 265,
    cy: 100,
    price: 8
  });
  var upgrade4 = new Upgrade({
    cx: 545,
    cy: 100,
    price: 12
  });
  g_roomDetails[0][0].upgrades.push(upgrade2);
  g_roomDetails[0][0].upgrades.push(upgrade3);
  g_roomDetails[0][0].upgrades.push(upgrade4);
},

update: function(du) {

  if(this._onMenu){
    this.updateMenu(du);
  }
  else{
    if(player != null){
      player.update(du);
    }

      for (var c = 0; c < this._categories.length; ++c) {

          var aCategory = this._categories[c];
          var i = 0;

          while (i < aCategory.length) {

              var status = aCategory[i].update(du);

              if (status === this.KILL_ME_NOW) {
                  // remove the dead guy, and shuffle the others down to
                  // prevent a confusing gap from appearing in the array
                  aCategory.splice(i,1);
              }
              else {
                  ++i;
              }
          }
      }
  }
  audioplayer.update();
},

updateMenu: function(du){

},
// For rendering the HUD elements
renderHUD: function(ctx){
  // Render life total
  for(var i = 0; i < Math.floor(player.currentHearts); i++){
    g_sprites.heart.drawCentredAt(ctx, 0 + 15 + (i * 22), 30);
  }
  if(player.currentHearts % 1 > 0){
    g_sprites.halfHeart.drawCentredAt(ctx, 0 + 15 + (Math.floor(player.currentHearts) * 22), 30);
  }
  for(var i = 0; i < (player.lives - Math.ceil(player.currentHearts)); i++){
    g_sprites.emptyHeart.drawCentredAt(ctx, 15 + ((Math.ceil(player.currentHearts) + i)* 22), 30);
  }

  // Render coin total
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.font = '25px Arial';
  ctx.strokeText(player.money + '$', g_canvas.width - 75, 30);
  ctx.fillText(player.money + '$', g_canvas.width - 75, 30);
},
// For rendering the text boxes of info items
renderInfo: function(ctx){
  for(var i = 0; i < this._info.length; i++){
      this._info[i].renderTextBox(ctx);
  }
},
// Renders the main menu
renderMenu: function(ctx){
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,g_canvas.width, g_canvas.height);
  ctx.font = '100px arial';
  ctx.fillStyle = 'white';
  ctx.fillText('DARK', g_canvas.width/3, g_canvas.height/4);
  ctx.fillStyle = 'gray';
  ctx.strokeStyle = 'white';
  ctx.font = '50px arial';
  ctx.fillRect(325, 300, 150, 50);
  ctx.strokeRect(325, 300, 150, 50);
  ctx.fillRect(325, 375, 150, 50);
  ctx.strokeRect(325, 375, 150, 50);
  ctx.fillStyle = 'white';
  ctx.fillText('Start', 345, 340);
  ctx.font = '26px arial';
  ctx.fillText('Instructions', 335, 410);
},
// Renders the instructions screen
renderInstructions: function(ctx){
  ctx.fillStyle = 'white';
  ctx.fillRect(0,0,g_canvas.width, g_canvas.height);
  ctx.fillStyle = 'black';
  ctx.font = '26px arial';
  ctx.fillText('- WASD to move', 50, 50);
  ctx.fillText('- Mouse to look around and shoot', 50, 100);
  ctx.fillText('- E to interact with objects/doors', 50, 150);
  ctx.fillText('- SPACEBAR to use aquired tool', 50, 200);
  ctx.fillText('- M to mute/unmute', 50, 250);
  ctx.fillText('- You can not leave a room unless you have killed', 50, 300);
  ctx.fillText('  all the enemies within it', 50, 325);

  ctx.fillStyle = 'gray';
  ctx.strokeStyle = 'black';
  ctx.fillRect(325, 500, 150, 50);
  ctx.strokeRect(325, 500, 150, 50);

  ctx.font = '50px arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Back', 345, 540);
},
// The main render function
render: function(ctx) {
  if(this._onInstructions){
    this.renderInstructions(ctx);
  }
  else if(this._onMenu){
    this.renderMenu(ctx);
  }
  else{
    if(g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].darkness){
      if(player != null){

        player.render(ctx);
      }
      ctx.fillStyle = 'white';
      ctx.fillRect((g_canvas.width - g_roomWidth)/2, (g_canvas.height - 100 - g_roomHeight)/2, g_roomWidth, g_roomHeight);
    }
    if(g_roomWidth === 800 && g_roomHeight === 600){
      ctx.drawImage(roomSprites[g_currentRoom[0]][g_currentRoom[1]],(g_canvas.width - g_roomWidth)/2, 0);
    }
    else if(g_roomWidth === 100 && g_roomHeight === 600){
      ctx.drawImage(g_images.hallwayVer,(g_canvas.width - g_roomWidth)/2, 0);
    }
    else if(g_roomWidth === 800 && g_roomHeight === 100){
      ctx.drawImage(g_images.hallwayHor,0, ((g_canvas.height) - g_roomHeight)/2);
    }
    ctx.strokeStyle = 'dark grey';
    ctx.strokeRect((g_canvas.width - g_roomWidth)/2, (g_canvas.height - g_roomHeight)/2, g_roomWidth, g_roomHeight);
    if(!g_roomDetails[g_currentRoom[0]][g_currentRoom[1]].darkness){
      if(player != null){
        player.render(ctx);

      }
    }
    this.renderHUD(ctx);

      var debugX = 10, debugY = 100;

      for (var c = 0; c < this._categories.length; ++c) {

          var aCategory = this._categories[c];

          for (var i = 0; i < aCategory.length; ++i) {

              aCategory[i].render(ctx);
              //debug.text(".", debugX + i * 10, debugY);

          }
          debugY += 10;
      }
      ctx.restore();
  }

  }

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
