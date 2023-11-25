/***************************************************
Jonathan Cheng
****************************************************/
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  scene: [MenuScene, Play, HelpScene, Gameover],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
};

let game = new Phaser.Game(config);

const tileHeight = 16; // height of one tile
const buildingHeightInTiles = 25; 
const groundLevel = config.height - (buildingHeightInTiles * tileHeight);

// General UI sizes for any boundary or UI elements in the game
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// Player movement and physics constants
let playerJumpForce = -250; // force at which the player character jumps up
let playerSpeed = 120;      // horizontal speed of the player

// Scoring system
let score = 0;              // player's current score
let highScore = 0;          // highest score achieved

// reserve keyboard vars for input
let keyUP, keyLEFT, keyRIGHT, keySpace;

// Game status flags
let gameOver = false;      // track if the game is currently in an over state

// Sound effects and music variables
let backgroundMusic;
let jumpSoundEffect;
let gameOverSoundEffect;

