
"use strict";

// Array of rooms, [0,0] signifies no room
var g_roomArray = [
                  [[600,800], [600,800],[600,800], [600,800]],
                  [[0,0],     [600,100], [0,0], [0,0]],
                  [[600,800], [600,800], [100,800], [600,800]]
                ];

var g_currentRoom = [2,1];
var g_startingRoom = [2,1];
var g_roomWidth = g_roomArray[g_currentRoom[0]][g_currentRoom[1]][1];
var g_roomHeight = g_roomArray[g_currentRoom[0]][g_currentRoom[1]][0];
var g_doorRadius = 35;
