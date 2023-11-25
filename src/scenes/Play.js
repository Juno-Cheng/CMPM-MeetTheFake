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
    }
    
    create() {
        
        // Place the background image in our game world
        const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
        // Scale the image to better match our game's resolution
        backgroundImage.displayWidth = this.sys.game.config.width;
        backgroundImage.displayHeight = this.sys.game.config.height;
        

        //==============================================================
        const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16});
        const tileset = map.addTilesetImage("custom_tileset","tiles");
        const layer = map.createLayer("toplayer", tileset, 0, groundLevel);
        layer.setCollisionByExclusion(-1, true);

        this.physics.world.createDebugGraphic();

       

        //==============================================================


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

        //========================
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


        
    }

    update(){
        this.player.update({
            keyLEFT: this.keyLEFT,
            keyRIGHT: this.keyRIGHT,
            keyUP: this.keyUP
        });

    }
        
}
