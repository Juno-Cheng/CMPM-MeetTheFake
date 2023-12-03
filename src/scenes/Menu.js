class MenuScene extends Phaser.Scene {
  constructor() {
      super('MenuScene'); // This refers to the identifier for this scene
  }

  preload() {
      // Load assets
      this.load.image('burgerboss', './assets/Images/bossStart.png');
      this.load.audio('buttonPress', './assets/Audio/press.wav');
      this.load.audio('backgroundMenu', './assets/Audio/backgroundMenu.wav'); 

      this.load.image('mute', './assets/Images/MuteIcon2.png');
      this.load.image('unmute', './assets/Images/MuteIcon.png');
  }

  create() {
    let highScore;
    if (this.registry.get('highScore') === undefined) {
      this.registry.set('highScore', 0);
      highScore = 0
    }
    else{
      highScore = this.registry.get('highScore');
    }

    this.cameras.main.backgroundColor.setTo(0, 0, 0);
    this.clickSound = this.sound.add('buttonPress');


    // Center the camera/view within the dimensions of the background
    this.cameras.main.centerToBounds();

    // Add title text at the bottom
    let burgerBossText = this.add.text(config.width / 2, config.height - 300, 'Burger Boss', { font: '30px "Press Start 2P"', fill: '#ffffff' });
    burgerBossText.setOrigin(0.5, 0.5);

    // Add high score text above the title
    let highScoreText = this.add.text(config.width / 2, config.height - 400, 'High Score:' + highScore , { font: '20px "Press Start 2P"', fill: '#ff0000' });
    highScoreText.setOrigin(0.5, 0.5);

    // Add 'Insert Coin' text above the high score
    let insertCoinText = this.add.text(config.width / 2, config.height - 350, 'Insert Coin - Press Space', { font: '20px "Press Start 2P"', fill: '#ff0000' });
    insertCoinText.setOrigin(0.5, 0.5);

     // Add 'Press Down for Credits Coin' text above the high score
     let creditsText = this.add.text(config.width / 2, config.height/2 + 200, 'Press Down for Credits', { font: '15px "Press Start 2P"', fill: '#ffffff' });
     creditsText.setOrigin(0.5, 0.5);

    this.time.addEvent({
      delay: 500,  // Blinking interval in milliseconds
      callback: () => {
        insertCoinText.visible = !insertCoinText.visible;
        creditsText.visible = !creditsText.visible;
      },
      loop: true
    });

    //Add image of "boss" in the middle
    this.add.image(config.width / 2, config.height / 2, 'burgerboss');
    
    const borderWidth = 10;
    const topAndBottomHalfBorderColor = 0xffff00; // Yellow color
    const bottomAndTopHalfBorderColor = 0x0000ff; // Blue color

    // Get the game's canvas size
    const canvasWidth = this.sys.game.config.width;
    const canvasHeight = this.sys.game.config.height;

    // Get the game's canvas size
    const halfHeight = canvasHeight / 2; // Calculate the half-height for the side borders

    // Draw the top border (yellow)
    const topBorder = this.add.graphics();
    topBorder.fillStyle(bottomAndTopHalfBorderColor, 1);
    topBorder.fillRect(0, 0, canvasWidth, borderWidth);

    // Draw the bottom border (blue)
    const bottomBorder = this.add.graphics();
    bottomBorder.fillStyle(topAndBottomHalfBorderColor, 1);
    bottomBorder.fillRect(0, canvasHeight - borderWidth, canvasWidth, borderWidth);

    // Draw the top half of the left border (blue)
    const leftTopHalfBorder = this.add.graphics();
    leftTopHalfBorder.fillStyle(bottomAndTopHalfBorderColor, 1);
    leftTopHalfBorder.fillRect(0, 0, borderWidth, halfHeight);

    // Draw the bottom half of the left border (yellow)
    const leftBottomHalfBorder = this.add.graphics();
    leftBottomHalfBorder.fillStyle(topAndBottomHalfBorderColor, 1);
    leftBottomHalfBorder.fillRect(0, halfHeight, borderWidth, halfHeight);

    // Draw the top half of the right border (blue)
    const rightTopHalfBorder = this.add.graphics();
    rightTopHalfBorder.fillStyle(bottomAndTopHalfBorderColor, 1);
    rightTopHalfBorder.fillRect(canvasWidth - borderWidth, 0, borderWidth, halfHeight);

    // Draw the bottom half of the right border (yellow)
    const rightBottomHalfBorder = this.add.graphics();
    rightBottomHalfBorder.fillStyle(topAndBottomHalfBorderColor, 1);
    rightBottomHalfBorder.fillRect(canvasWidth - borderWidth, halfHeight, borderWidth, halfHeight);


    // Play background music
    let music = this.sound.add('backgroundMenu', {
      loop: true // This will make the track loop
    });

    let muteButton = this.add.image(config.width/6 - 50, config.height - 20, 'mute').setInteractive();
    let isMuted = false;
    muteButton.on('pointerdown', () => {
      // Check if the audio context is suspended
      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }
  
      // Toggle the music play/mute
      if (!isMuted) {
        music.pause();
        muteButton.setTexture('mute'); // Change button to 'mute' image
      } else {
        // If the music hasn't started yet, start it; otherwise resume it
        if (music.isPaused) {
          music.resume();
        } else {
          music.play();
        }
        muteButton.setTexture('unmute'); // Change button to 'unmute' image
      }
      // Flip the isMuted boolean
      isMuted = !isMuted;
    });
  

    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

  }

  update() {
    
    //If Spacebar is Pressed
    if (Phaser.Input.Keyboard.JustDown(keySpace)) {
      this.sound.play('buttonPress');
      this.scene.start("HelpScene");
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyDown)) {
      this.sound.play('buttonPress');
      this.scene.start("CreditsScene"); // Replace "CreditsScene" with the key of your credits scene
  }


  }

}

//Add animation under image once all scenes are made