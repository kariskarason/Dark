// ====
// DARK
// ====


"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var player;
var g_roomDetails = [];
// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();

    entityManager.update(du);

}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

//var KEY_MIXED   = keyCode('M');;
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

function processDiagnostics() {


    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
}


// =================
// RENDER SIMULATION
// =================


// GAME-SPECIFIC RENDERING


function renderSimulation(ctx) {
    entityManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        // PLayer images
        player: "https://notendur.hi.is/ksk12/images/player.png",

        // Enemy images
        enemy: "https://notendur.hi.is/ksk12/images/enemy11.png",
        diagDude: "https://notendur.hi.is/ksk12/images/diagDude.png",
        bossHead: "https://notendur.hi.is/ksk12/images/bossHead.png",

        // Projectile images
        bullet: "https://notendur.hi.is/ksk12/images/shot.png",
        enemyBullet: "https://notendur.hi.is/ksk12/images/enemyShot.png",

        // Pickup images
        goldCoin: "https://notendur.hi.is/ksk12/images/goldCoin.png",
        silverCoin: "https://notendur.hi.is/ksk12/images/silverCoin.png",
        bronzeCoin: "https://notendur.hi.is/ksk12/images/bronzeCoin.png",

        // Upgrade images
        shotgun: "https://notendur.hi.is/ksk12/images/shotgun.png",
        submachineGun: "https://notendur.hi.is/ksk12/images/submachineGun.png",
        cursedTimepiece: "https://notendur.hi.is/ksk12/images/cursedTimepiece.png",
        piercingBullets: "https://notendur.hi.is/ksk12/images/piercingBullets.png",
        healthLiquid: "https://notendur.hi.is/ksk12/images/healthLiquid.png",
        bigBullets: "https://notendur.hi.is/ksk12/images/bigBullets.png",

        // Room images
        hallwayVer: "https://notendur.hi.is/ksk12/images/hallwayVer.png",
        hallwayHor: "https://notendur.hi.is/ksk12/images/hallwayHor.png",
        room01: "https://notendur.hi.is/ksk12/images/room01.png",
        room02: "https://notendur.hi.is/ksk12/images/room02boss.png",
        room03: "https://notendur.hi.is/ksk12/images/room03.png",
        room20: "https://notendur.hi.is/ksk12/images/room20.png",
        room21: "https://notendur.hi.is/ksk12/images/room21.png",
        room23: "https://notendur.hi.is/ksk12/images/room23.png",
        room00: "https://notendur.hi.is/ksk12/images/room00.png",

        // Heart images
        hearth: "https://notendur.hi.is/ksk12/images/heart.png",
        halfHeart: "https://notendur.hi.is/ksk12/images/halfHeart.png",
        emptyHeart: "https://notendur.hi.is/ksk12/images/emptyHeart.png",

        info: "https://notendur.hi.is/ksk12/images/info.png",

        // Box images
        box1: "https://notendur.hi.is/ksk12/images/box1.png",
        box2: "https://notendur.hi.is/ksk12/images/box2.png",
        box3: "https://notendur.hi.is/ksk12/images/box3.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};
var powerupSprites;
var upgradeSprites;
var roomSprites;

function preloadDone() {

    g_sprites.player  = new Sprite(g_images.player);
    g_sprites.enemy = new Sprite(g_images.enemy);
    g_sprites.enemy2 = new Sprite(g_images.diagDude);
    g_sprites.bossHead = new Sprite(g_images.bossHead);

    g_sprites.heart = new Sprite(g_images.hearth);
    g_sprites.halfHeart = new Sprite(g_images.halfHeart);
    g_sprites.emptyHeart = new Sprite(g_images.emptyHeart);

    g_sprites.box1 = new Sprite(g_images.box1);
    g_sprites.box2 = new Sprite(g_images.box2);
    g_sprites.box3 = new Sprite(g_images.box3);

    g_sprites.bullet = new Sprite(g_images.bullet);
    g_sprites.bullet.scale = 0.5;
    g_sprites.enemyBullet = new Sprite(g_images.enemyBullet);
    g_sprites.enemyBullet.scale = 0.5;

    g_sprites.goldCoin = new Sprite(g_images.goldCoin);
    g_sprites.silverCoin = new Sprite(g_images.silverCoin);
    g_sprites.bronzeCoin = new Sprite(g_images.bronzeCoin);

    g_sprites.shotgun = new Sprite(g_images.shotgun);
    g_sprites.submachineGun = new Sprite(g_images.submachineGun);
    g_sprites.cursedTimepiece = new Sprite(g_images.cursedTimepiece);
    g_sprites.piercingBullets = new Sprite(g_images.piercingBullets);
    g_sprites.healthLiquid = new Sprite(g_images.healthLiquid);
    g_sprites.bigBullets = new Sprite(g_images.bigBullets);

    g_sprites.info = new Sprite(g_images.info);

    powerupSprites = [g_sprites.halfHeart, g_sprites.heart, g_sprites.bronzeCoin, g_sprites.silverCoin, g_sprites.goldCoin];

    upgradeSprites = [g_sprites.shotgun, g_sprites.submachineGun, g_sprites.cursedTimepiece, g_sprites.piercingBullets, g_sprites.healthLiquid, g_sprites.bigBullets];

    roomSprites = [
                      [g_images.room00, g_images.room01, g_images.room02, g_images.room03],
                      [null,     g_images.hallwayVer, null, null],
                      [g_images.room20, g_images.room21, g_images.hallwayHor, g_images.room23]
                    ];

    entityManager.init();

    player = new Player({
      cx: g_canvas.width/2,
      cy: g_canvas.height - 30
    });

    entityManager.initRooms();
    entityManager.spawnRoom();
    entityManager.initializeUpgrades();
    entityManager.initializePowerups();
    entityManager.placeUpgrades();
    entityManager.placeInfo();

    main.init();
    audioplayer.startSong();
}

// Kick it off
requestPreloads();
