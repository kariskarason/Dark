// ==============
// MOUSE HANDLING
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var g_mouseX = 0,
    g_mouseY = 0;
var intervalId = -1;

function handleMouse(evt) {

    g_mouseX = evt.clientX - g_canvas.offsetLeft;
    g_mouseY = evt.clientY - g_canvas.offsetTop;


    if(player != null){
      player.rotation = Math.atan2(player.cy - g_mouseY, player.cx - g_mouseX) + 270* (Math.PI / 180);
    }
}

// Handles the mousekey being pressed
function handleMouseDown(evt){
  // If instructions are being viewed, look for button press
  if(entityManager._onInstructions){
    if(g_mouseX >= 325 && g_mouseX <= 475 && g_mouseY >= 500 && g_mouseY <= 550){
      entityManager._onInstructions = false;
    }
  }
  // If menu is being viewed, look for button presses
  else if(entityManager._onMenu){
    if(g_mouseX >= 325 && g_mouseX <= 475 && g_mouseY >= 300 && g_mouseY <= 350){
      entityManager._onMenu = false;
    }
    if(g_mouseX >= 325 && g_mouseX <= 475 && g_mouseY >= 375 && g_mouseY <= 425){
      entityManager._onInstructions = true;
    }
  }
  // Else, fire bullet for player
  else{
    if(player.weapon === 'submachineGun'){

      if(intervalId === -1){

        intervalId = setInterval(shoot, 100);
      }

    }
    player.fireBullet();
  }

}

function handleMouseUp(evt){
  if(intervalId != -1){
    clearInterval(intervalId);
    intervalId = -1;
  }
}

function shoot(){
  player.fireBullet();
}

// Handle "down" and "move" events the same way.
window.addEventListener("mousedown", handleMouseDown);
window.addEventListener("mousemove", handleMouse);
window.addEventListener("mouseup", handleMouseUp);
