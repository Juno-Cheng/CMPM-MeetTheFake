class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        this.setScale(1, 1);
        
        // Adding the player to the scene
        scene.add.existing(this);  // necessary for displaying the texture
        scene.physics.add.existing(this);  // necessary for physics to act on the sprite

        // Player physics properties. Adjust the body settings here as needed
        this.setCollideWorldBounds(true); // Player cannot move out of the game world

        this.body.setSize(this.width * 1, this.height * 1); 
        //this.body.setOffset(this.width * 0.1, this.height * 1); 

        // Initialize player properties from global variables
        this.moveSpeed = playerSpeed;
        this.jumpStrength = playerJumpForce;
        this.jumpSound = null;
        this.isTouchingGround = true;

        //Add statemachine

    }

    initAnimations() {
        this.scene.anims.create({
            key: 'idle-right',
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, { frames: [0] }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'idle-left',
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, { frames: [3] }),
            frameRate: 3,
            repeat: -1
        });


        this.scene.anims.create({
            key: 'walk-right',
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
    
        // Walking left animation: tiles 4-6
        this.scene.anims.create({
            key: 'walk-left',
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, { start: 3, end: 5 }),
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
            key: 'attack-right',
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, { frames: [8] }),
            frameRate: 1,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'attack-left',
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, { frames: [9] }),
            frameRate: 1,
            repeat: 0
        });
    }


    // The keys object is expected to contain keys: keyLEFT, keyRIGHT, keyUP
    update(keys) {
        if (!this.attackCooldown){
        if (keys.keyLEFT.isDown) {
            this.setVelocityX(-this.moveSpeed);
            this.anims.play('walk-left', true);
            this.lastDirection = 'left';
        } else if (keys.keyRIGHT.isDown) {
            this.setVelocityX(this.moveSpeed);
            this.anims.play('walk-right', true);
            this.lastDirection = 'right';
        } else {
            this.setVelocityX(0);
            // Use if statements to determine which idle animation to play
            if (this.lastDirection === 'left') {
                this.anims.play('idle-left', true);
            } else {
                // Default to idle-right if lastDirection is not 'left'
                this.anims.play('idle-right', true);
            }
        }
    }
    
        // Handle jumping
        if (keys.keyUP.isDown && this.isTouchingGround) {
            this.setVelocityY(this.jumpStrength);
            this.anims.play('jump', true);
            // The flag should be reset when the player jumps
            this.isTouchingGround = false;
            this.scene.sound.play('jump');
        }

        // Reset the isTouchingGround flag if the player is not on the ground
        // This should be the only place where you set this to false
        if (!this.body.blocked.down && this.body.velocity.y !== 0) {
            this.isTouchingGround = false;
        }

        //Handle Attack
        if (Phaser.Input.Keyboard.JustDown(keys.keySPACE)) {
            this.attack();
        }


        
    }

    attack() {
        if (this.attackCooldown) {
            return; // Exit if already in cooldown
        }
        this.setVelocityX(0);
        this.attackCooldown = true;
    
        // Determine the direction and play the corresponding attack animation
        if (this.lastDirection === 'left') {
            this.anims.play('attack-left', true);
            this.scene.sound.play('attack');
        } else {
            this.anims.play('attack-right', true);
            this.scene.sound.play('attack');
        }
    
        // Create hitbox based on the direction of the attack
        let hitboxX = this.x + (this.lastDirection === 'right' ? this.width / 2 : -this.width / 2);
        let hitbox = this.scene.add.rectangle(
            hitboxX, this.y, 
            this.width, this.height, 
            0xff0000, 0.5 // Red color for visualization
        );
        this.scene.physics.add.existing(hitbox, true); // 'true' for a static body
        hitbox.body.isSensor = true; // Makes it not physically interact with objects
    
        // Collision with enemies
        this.scene.physics.add.overlap(hitbox, this.scene.enemies, (hitbox, enemy) => {
            // Handle enemy defeat
            enemy.defeat(); // Implement this method in your enemy class
        });
    
        // Remove hitbox after 1 second
        this.scene.time.delayedCall(1000, () => {
            hitbox.destroy();
        });
    
        // Reset cooldown after 1 second
        this.scene.time.delayedCall(1000, () => {
            this.attackCooldown = false;
        });
    }
    
    

}

