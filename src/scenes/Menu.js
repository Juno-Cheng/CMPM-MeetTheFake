class MenuScene extends Phaser.Scene {
  constructor() {
      super('MenuScene'); // This refers to the identifier for this scene
  }

  preload() {
      // Load assets
      this.load.image('background', './assets/background.png');
      this.load.audio('backgroundMusic', './assets/background.mp3');
      this.load.audio('clickSound', './assets/click.wav');
  }

  create() {
    this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
    this.background.setOrigin(0, 0);
    this.clickSound = this.sound.add('clickSound');


    // Center the camera/view within the dimensions of the background
    this.cameras.main.centerToBounds();

    // Add title text
    let title = this.add.text(config.width / 2, 90, 'Slime Jumper', { font: '30px "Press Start 2P"', fill: '#ffffff' });
    title.setOrigin(0.5, 0.5); // Center the title

    // Add buttons
    let playButton = this.add.text(config.width / 2, 200, 'START', { font: '20px "Press Start 2P"', fill: '#ff0000' });
    playButton.setInteractive({ useHandCursor: true });
    playButton.setOrigin(0.5, 0.5);
    playButton.on('pointerdown', () => {
      this.sound.play('clickSound');
      this.scene.start('playScene');
    }); 

    let helpButton = this.add.text(config.width / 2, 260, 'HELP', { font: '20px "Press Start 2P"', fill: '#ff0000' });
    helpButton.setInteractive({ useHandCursor: true });
    helpButton.setOrigin(0.5, 0.5);
    helpButton.on('pointerdown', () => {
      this.sound.play('clickSound');
      this.scene.start('HelpScene');
    }); 



      // Play background music
      let music = this.sound.add('backgroundMusic');
      music.play({
          loop: true // This will make the track loop
      });


  }

  update() {
    this.background.tilePositionX -= .5;  //Shifts Background texture
  }
}

