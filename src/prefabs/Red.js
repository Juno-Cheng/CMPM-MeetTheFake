class Red extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, count) {
    super(scene, x, y, texture);

    // Scale and add the enemy to the scene
    this.setScale(1, 1);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Enemy properties
    this.setCollideWorldBounds(true); // Enemy cannot move out of the game world
    // Adjust the body size to be half the width and same height
    this.body.setSize(this.width / 2, this.height);

    // Offset the body to be centered
    this.body.setOffset(this.width / 4, 0);
    this.moveSpeed = 20;
    this.movingLeft = true; // Initially moving left

    // Set up a timed event for changing direction
    scene.time.addEvent({
      delay: count * 1000, // Convert count from seconds to milliseconds
      callback: this.turnAround,
      callbackScope: this,
      loop: true,
    });
  }

  initAnimations() {
    // Initialize animations
    this.scene.anims.create({
      key: "enemy-right",
      frames: this.scene.anims.generateFrameNumbers(this.texture.key, {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "enemy-left",
      frames: this.scene.anims.generateFrameNumbers(this.texture.key, {
        start: 2,
        end: 3,
      }),
      frameRate: 2,
      repeat: -1,
    });
  }

  update() {
    //console.log('Current Texture:', this.texture.key, 'Frame:', this.frame.name);
    // Set the velocity and play the animation based on the movingLeft flag - Changes Movement based on Time
    this.setVelocityX(this.movingLeft ? -this.moveSpeed : this.moveSpeed);

    if (this.movingLeft) {
      this.anims.play("enemy-right", true);
    } else {
      this.anims.play("enemy-left", true);
    }
  }

  turnAround() {
    // Change the movement direction
    this.movingLeft = !this.movingLeft;
  }
}
