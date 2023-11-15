//If you’re new to JavaScript, you might’ve noticed that odd keyword this while typing the above code. 
//this is a confusing concept in JS, but the basic idea is that it’s a special keyword bound to the current 
//object context. In the example above, this references the Scene object.

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
        this.score = 0;
    }
    
    preload() {

        this.load.image('arrow', './assets/Arrow.png');
        this.load.image('player', './assets/Player.png');
        this.load.image('platform', './assets/island.png');
        this.load.image('background', './assets/background.png');

        this.load.audio('deathSound', './assets/dead.wav');
        this.load.audio('speedSound', './assets/speed.wav');
        this.load.audio('jump', './assets/jump.wav');

        this.load.spritesheet('jump', './assets/jump.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        
    }

    create() {
        //Background
        this.score = 0;
        let platformSpeed = 150;

        this.anims.create({
            key: 'jumping',
            frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: 0
        });

        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
        this.background.setOrigin(0, 0);

        //Sound:
        this.deathSound = this.sound.add('deathSound');
        this.speedSound = this.sound.add('speedSound');


        //Group:
        this.platforms = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        //Start with Player spawning in the middle and 1 large platform the is scaled, so a spawning point, the platform will slowly move to the left
        this.player = new Player(this, config.width / 2, config.height / 2, 'player');
        this.player.jumpSound = this.sound.add('jump');

        // Create the initial spawning platform
        this.spawnPlatform(config.width / 2, config.height - 60); 

        this.physics.add.collider(this.player, this.platforms);

        //Define Keys
        this.keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        this.nextSpawnTime = this.time.now + 1400;
        this.delay = this.time.now + 1500;
        this.increase = this.time.now + 10000;
        this.ratio = 2000;

        //Score:
        // Create the score text
        this.scoreText = this.add.text(25, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });

        // Create a timed event that runs every 1000 milliseconds (1 second)
        this.scoreTimer = this.time.addEvent({
            delay: 1000,                // 1000ms = 1 second
            callback: this.updateScore, // function to call each time
            callbackScope: this,        // scope in which to call the function
            loop: true                  // repeat forever
        });
        this.end = 0;
    }

    update(time, delta) {
        this.background.tilePositionX -= .5;
        this.player.update({
            keyLEFT: this.keyLEFT,
            keyRIGHT: this.keyRIGHT,
            keyUP: this.keyUP
        });

        if (this.player.y > config.height && this.end == 0) {
            this.end = 1;
            this.gameOver();
        }

        if (time > this.delay) {
            this.platforms.getChildren().forEach(platform => {
                platform.update();
                
                if (platform.x + platform.width/2 < 0) {
                    platform.destroy();
                }

            });
        }

        if (time > this.nextSpawnTime) {
            this.spawnPlatform(config.width+100, Phaser.Math.Between(config.height - 100, config.height - 25), 1);
            this.nextSpawnTime = time + this.ratio;  // Set the next spawn time
        }

        if (time > this.increase) {
            this.increasePlatformSpeed();
            this.increase = this.time.now + 3000; // Set the next increase time
        }

    }

    spawnPlatform(x, y, scaleX) {
        if (!this.platforms) {
            this.platforms = this.physics.add.group();
        }
        let platform = new Platform(this, x, y, 'platform');
        this.platforms.add(platform);
    }

    increasePlatformSpeed() {
        platformSpeed += 10; // Ensure you have this.platformSpeed initialized somewhere in the class
        this.ratio -= 20
        this.speedSound.play();
    }

    gameOver() {
        this.deathSound.play();
        this.time.delayedCall(300, () => {
            this.scene.start('GameOverScene', { score: this.score });
        }, this);

    }
    updateScore() {
        // Increase the score by 1 (or however much you want per second)
        this.score += 1;

        // Update the score text
        if (this.scoreText) {
            this.scoreText.setText('Score: ' + this.score);
        }
    }

} 