class Play extends Phaser.Scene {
    constructor() {
        super('playScene'); 
    }
    preload(){

        //Load Background
        this.load.image('background', 'assets/Images/Background.png')

        this.load.image('tiles', 'assets/TileSet/TileMap.png');
        this.load.image('tomato', 'assets/TileSet/Tomato.png')

        this.load.tilemapTiledJSON('map','assets/TileMap/map1.json');

        //Load Player
        this.load.spritesheet('player', 'assets/Images/BurgerBoss.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.score = 0;
        this.lives = 3;
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

        this.player = new Player(this, 100, 100, 'player');
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

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
        this.scoreText.setScrollFactor(0);  // Ensures the text doesn't scroll with the camera

        // Create a lives text object
        this.livesText = this.add.text(16, 56, 'Lives: 3', { fontSize: '32px', fill: '#fff' });
        this.livesText.setScrollFactor(0); 




        //========================
        

        
    }

    update(){
        this.player.update({
            keyLEFT: this.keyLEFT,
            keyRIGHT: this.keyRIGHT,
            keyUP: this.keyUP
        });





    }
        
}
