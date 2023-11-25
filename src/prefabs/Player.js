class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        this.setScale(1, 1);
        
        // Adding the player to the scene
        scene.add.existing(this);  // necessary for displaying the texture
        scene.physics.add.existing(this);  // necessary for physics to act on the sprite

        // Player physics properties. Adjust the body settings here as needed
        this.setCollideWorldBounds(true); // Player cannot move out of the game world

        this.body.setSize(this.width * 0.8, this.height * .1); 
        this.body.setOffset(this.width * 0.1, this.height * 0.1); 

        // Initialize player properties from global variables
        this.moveSpeed = playerSpeed;
        this.jumpStrength = playerJumpForce;
        this.jumpSound = null;

        //Add statemachine

    }

    initAnimations() {
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, { frames: [0, 3] }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, { start: 6, end: 7 }),
            frameRate: 5,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'attack',
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, { start: 8, end: 9 }),
            frameRate: 10,
            repeat: 0
        });
    }


    // The keys object is expected to contain keys: keyLEFT, keyRIGHT, keyUP
    update(keys) {
        if (keys.keyLEFT.isDown) {
            this.setVelocityX(-this.moveSpeed);  // move left
            this.anims.play('walk', true);      // play walk animation
            this.setFlipX(true);                // flip the sprite to face left
        } else if (keys.keyRIGHT.isDown) {
            this.setVelocityX(this.moveSpeed);  // move right
            this.anims.play('walk', true);      // play walk animation
            this.setFlipX(false);               // flip the sprite to face right
        } else {
            this.setVelocityX(0);               // stop moving horizontally
            this.anims.play('idle', true);      // play idle animation
        }

        // Handle jumping
        if (keys.keyUP.isDown && this.body.touching.down) {
            this.setVelocityY(-this.jumpStrength);
            this.anims.play('jump', true);      // play jump animation
        }

        

        
    }
}

