class Play extends Phaser.Scene {
    constructor() {
        super('playScene'); 
    }
    preload(){

        //Load Background
        this.load.image('background', 'assets/Images/Background.png')

        this.load.image('tiles', 'assets/TileSet/TileMap.png');
        this.load.image('tomato', 'assets/TileSet/Tomato.png');

        this.load.tilemapTiledJSON('map','assets/TileMap/map1.json');

        //Load Player
        this.load.spritesheet('player', 'assets/Images/BurgerBoss.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.score = 0;
        this.lives = 3;
        this.remainingTime = 300;

        this.load.audio('pickup', 'assets/Audio/pickup.wav');
    }
    
    create() {
        
        //Background
        const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16});
        // Place the background image in our game world
        const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
        // Scale the image to better match our game's resolution
        backgroundImage.displayWidth = this.sys.game.config.width;
        backgroundImage.displayHeight = this.sys.game.config.height;

        this.backgroundTileSprite = this.add.tileSprite(0, 0, map.widthInPixels,  this.sys.game.config.height, 'background').setOrigin(0, 0);
        const backgroundScaleY = this.sys.game.config.height / this.textures.get('background').getSourceImage().height;
        this.backgroundTileSprite.setScale(1, backgroundScaleY);

        //==============================================================
        //Tileset
        
        const tileset = map.addTilesetImage("custom_tileset","tiles");
        const layer = map.createLayer("toplayer", tileset, 0, groundLevel);
        layer.setCollisionByExclusion(-1, true);

        this.physics.world.createDebugGraphic();
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        //==============================================================
        //Player
        this.keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.player = new Player(this, 100, 50, 'player');
        this.player.initAnimations();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.setBounce(0.1);

        this.physics.add.collider(this.player, layer, () => {
            if (this.player.body.blocked.down) {
                this.player.isTouchingGround = true;
            }
        });

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setZoom(1.5);
        const cam = this.cameras.main;
        const zoomFactor = cam.zoom;
        //==============================================================

        
        this.scoreText = this.add.text(144, 96, 'Score: 0', { fontSize: '16px', fill: '#fff' });
        this.scoreText.setScrollFactor(0);  // Ensures the text doesn't scroll with the camera

        // Create a lives text object
        this.livesText = this.add.text(144, 120, 'Lives: 3', { fontSize: '16px', fill: '#fff' });
        this.livesText.setScrollFactor(0); 

        this.timerText = this.add.text(144, 144, 'Time: 300', { fontSize: '16px', fill: '#fff' });
        this.timerText.setScrollFactor(0);

        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });


        //========================
        const pointsLayer = map.getObjectLayer('points')['objects'];

        // Create a group for the points
        this.tomatoes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        // Add each tomato object to the game
        pointsLayer.forEach(point => {
            const pointSprite = this.tomatoes.create(point.x, point.y, 'tomato').setOrigin(0);
            pointSprite.body.setSize(point.width, point.height); // Adjust if your point objects have a specific size
        });
        this.physics.add.overlap(this.player, this.tomatoes, this.collectTomato, null, this);

        
    }

    updateTimer() {
        this.remainingTime -= 1; // Decrement the remaining time by one second
        this.timerText.setText('Time: ' + this.remainingTime);
    
        // If the countdown reaches zero, end the game
        if (this.remainingTime <= 0) {
            this.timeUp(); // Call a method to handle what happens when time is up
        }
    }

    
    timeUp() {
        // Handle time up scenario, such as ending the game or transitioning to a game over scene
        this.scene.start('gameOverScene');
    }

    update(){
        this.player.update({
            keyLEFT: this.keyLEFT,
            keyRIGHT: this.keyRIGHT,
            keyUP: this.keyUP
        });

    }


    increaseScore(points) {
        this.score += points;
        this.scoreText.setText('Score: ' + this.score);
    }
    
    // Call this method when the player loses a life
    loseLife() {
        this.lives -= 1;
        this.livesText.setText('Lives: ' + this.lives);
    
        // Check for game over condition
        if (this.lives <= 0) {
            // Handle game over (e.g., restart the scene or go to a game over scene)
            this.scene.start('gameOverScene');
        }
    }

    collectTomato(player, tomato) {
        tomato.disableBody(true, true); // This hides and deactivates the tomato
        this.increaseScore(10); // Increase the score by 10, for example
        this.sound.play('pickup');
    }


        
}
