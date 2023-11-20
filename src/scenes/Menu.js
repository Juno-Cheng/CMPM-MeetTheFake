class MenuScene extends Phaser.Scene {
  constructor() {
      super('MenuScene'); // This refers to the identifier for this scene
  }

  preload() {
      // Load assets
      this.load.image('burgerboss', './assets/background.png');
      this.load.audio('buttonPress', './assets/press.wav');
  }

  create() {
    this.cameras.main.backgroundColor.setTo(0, 0, 0);
    this.clickSound = this.sound.add('buttonPress');


    // Center the camera/view within the dimensions of the background
    this.cameras.main.centerToBounds();

    // Add title text at the bottom
    let burgerBossText = this.add.text(config.width / 2, config.height - 60, 'Burger Boss', { font: '30px "Press Start 2P"', fill: '#ffffff' });
    burgerBossText.setOrigin(0.5, 0.5);

    // Add high score text above the title
    let highScoreText = this.add.text(config.width / 2, config.height - 120, 'High Score: 0', { font: '30px "Press Start 2P"', fill: '#ff0000' });
    highScoreText.setOrigin(0.5, 0.5);

    // Add 'Insert Coin' text above the high score
    let insertCoinText = this.add.text(config.width / 2, config.height - 180, 'Insert Coin - Press Space', { font: '30px "Press Start 2P"', fill: '#ff0000' });
    insertCoinText.setOrigin(0.5, 0.5);

    this.time.addEvent({
      delay: 500,  // Blinking interval in milliseconds
      callback: () => {
        insertCoinText.visible = !insertCoinText.visible;
      },
      loop: true
    });

    //Add image of "boss" in the middle
    this.add.image(config.width / 2, config.height / 2, 'burgerboss');
    


    // Play background music
    let music = this.sound.add('backgroundMusic');
    music.play({
      loop: true // This will make the track loop
    });

    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    
    //If Spacebar is Pressed
    if (Phaser.Input.Keyboard.JustDown(keySpace)) {
      this.sound.play('buttonPress');
      this.scene.start("playScene");
    }



  }



}

//Add animation under image once all scenes are made