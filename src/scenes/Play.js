class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }
  preload() {
    //Load Background
    this.load.image("background", "assets/Images/Background.png");

    this.load.image("tiles", "assets/TileSet/TileMap.png");
    this.load.image("tomato", "assets/TileSet/Tomato.png");
    this.load.image("endTile", "assets/TileSet/end.png");

    this.load.tilemapTiledJSON("map", "assets/TileMap/map1.json");

    //Load Player
    this.load.spritesheet("player", "assets/Images/BurgerBoss.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.score = 0;
    this.lives = 3;
    this.remainingTime = 300;
    this.hasFallen = true;

    this.load.audio("pickup", "assets/Audio/pickup.wav");
    this.load.audio("death", "assets/Audio/death.wav");
    this.load.audio("jump", "assets/Audio/jump.wav");
    this.load.audio("attack", "assets/Audio/attack.wav");
    this.load.audio("kill", "assets/Audio/kill.wav");
    //Load Enemies:

    this.load.spritesheet("red", "assets/Enemy/red.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("yellow", "assets/Enemy/yellow.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.end = false;
  }

  create() {
    this.isLoseLifeEnabled = false;
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.isLoseLifeEnabled = true;
      },
    });

    this.hasFallen = true;

    this.time.delayedCall(3000, () => {
      // 2000 milliseconds = 2 seconds
      this.hasFallen = false;
    });
    //Background
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
    });
    // Place the background image in our game world
    const backgroundImage = this.add.image(0, 0, "background").setOrigin(0, 0);
    // Scale the image to better match our game's resolution
    backgroundImage.displayWidth = this.sys.game.config.width;
    backgroundImage.displayHeight = this.sys.game.config.height;

    this.backgroundTileSprite = this.add
      .tileSprite(
        0,
        0,
        map.widthInPixels,
        this.sys.game.config.height,
        "background"
      )
      .setOrigin(0, 0);
    const backgroundScaleY =
      this.sys.game.config.height /
      this.textures.get("background").getSourceImage().height;
    this.backgroundTileSprite.setScale(1, backgroundScaleY);

    //==============================================================
    //Tileset

    const tileset = map.addTilesetImage("custom_tileset", "tiles");
    const layer = map.createLayer("toplayer", tileset, 0, groundLevel);
    layer.setCollisionByExclusion(-1, true);
    //Debug Tools
    //this.physics.world.createDebugGraphic();
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    //==============================================================
    //Player
    this.keyLEFT = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this.keyRIGHT = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keySPACE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.player = new Player(this, 50, 300, "player");
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
    //Score/Lives/Time

    this.scoreText = this.add.text(144, 96, "Score: 0", {
      fontSize: "14px",
      fill: "#fff",
    });
    this.scoreText.setScrollFactor(0); // Ensures the text doesn't scroll with the camera

    // Create a lives text object
    this.livesText = this.add.text(144, 120, "Lives: 3", {
      fontSize: "14px",
      fill: "#fff",
    });
    this.livesText.setScrollFactor(0);

    this.timerText = this.add.text(144, 144, "Time: 300", {
      fontSize: "14px",
      fill: "#fff",
    });
    this.timerText.setScrollFactor(0);

    //Removed Blur - High Cost do NOT USE OFTEN
    this.scoreText.setResolution(5);
    this.livesText.setResolution(5);
    this.timerText.setResolution(5);

    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    //===========Create Tomato Points=============
    const pointsLayer = map.getObjectLayer("points")["objects"];

    // Create a group for the points
    this.tomatoes = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // Add each tomato object to the game
    pointsLayer.forEach((point) => {
      const pointSprite = this.tomatoes
        .create(point.x, point.y + groundLevel - 16, "tomato")
        .setOrigin(0);
      pointSprite.body.setSize(point.width, point.height);
    });
    this.physics.add.overlap(
      this.player,
      this.tomatoes,
      this.collectTomato,
      null,
      this
    );

    //===========Create End Area=============
    //Adds collision box to End Objects
    const endObjects = map.getObjectLayer("end").objects;

    this.obj = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    endObjects.forEach((endObj) => {
      const endSprite = this.obj
        .create(endObj.x, endObj.y + groundLevel - 16, "endTile")
        .setOrigin(0);
      const hitboxWidth = endObj.width * 1.5; // Extend the width
      const hitboxHeight = endObj.height * 1.5; // Extend the height
      endSprite.body.setSize(hitboxWidth, hitboxHeight);

      const offsetX = (hitboxWidth - endObj.width) / 2;
      const offsetY = (hitboxHeight - endObj.height) / 2;
      endSprite.body.setOffset(-offsetX, -offsetY);
    });

    this.physics.add.overlap(
      this.player,
      this.obj,
      this.onLevelComplete,
      null,
      this
    );
    //===========Spawn Enemies=============
    this.enemies = this.physics.add.group();

    const enemyPositions = [
      { x: 280, y: 264, time: 3 },
      { x: 488, y: 200, time: 4 },
      { x: 1128, y: 232, time: 5 },
      { x: 1608, y: 296, time: 3 },
      { x: 1864, y: 216, time: 6 },
      { x: 2264, y: 232, time: 4 },
      { x: 2624, y: 280, time: 2 },
      { x: 3000, y: 248, time: 3 },
      { x: 3234, y: 280, time: 5 },
    ];

    enemyPositions.forEach((pos) => {
      // Randomly choose 'red' or 'yellow'
      const color = Math.random() < 0.5 ? "red" : "yellow";
      const enemyClass = color === "red" ? Red : Yellow;

      const enemy = new enemyClass(this, pos.x, pos.y, color, pos.time);
      enemy.initAnimations();
      this.enemies.add(enemy);
    });

    // Initialize Animations
    this.enemies.getChildren().forEach((enemy) => {
      enemy.initAnimations();
    });

    // Add collision between the layer and each enemy in the group
    this.physics.add.collider(this.enemies, layer);

    // Add overlap detection between the player and each enemy in the group
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerEnemyCollision,
      null,
      this
    );
  }

  updateTimer() {
    this.remainingTime -= 1; // Decrement the remaining time by one second
    this.timerText.setText("Time: " + this.remainingTime);

    // If the countdown reaches zero, end the game
    if (this.remainingTime <= 0) {

      this.onLevelComplete(); // Call a method to handle what happens when time is up
    }
  }



  update() {
    //Updates Player Movement
    if (this.end == false){
    this.player.update({
      keyLEFT: this.keyLEFT,
      keyRIGHT: this.keyRIGHT,
      keyUP: this.keyUP,
      keySPACE: this.keySPACE,
    });}


    if (
      this.isLoseLifeEnabled &&
      this.player.y > this.cameras.main.worldView.bottom - 16 &&
      !this.player.hasFallen
    ) {
      console.log(
        "isLoseLifeEnabled: " + this.isLoseLifeEnabled,
        "Player Y: " + this.player.y,
        "Camera Bottom: " + (this.cameras.main.worldView.bottom - 16),
        "hasFallen: " + this.player.hasFallen
      );
      this.player.hasFallen = true; // Set the flag
      this.loseLife();
    }

    // Reset the flag when the player is back in a safe position
    if (this.player.y < this.cameras.main.worldView.bottom - 16) {
      this.player.hasFallen = false;
    }
    //console.log(this.player.y);//392
    //console.log('Player X:' + this.player.x +  'Player Y: ' + this.player.y + ', Camera Bottom + 16: ' + (this.cameras.main.worldView.bottom-16));
    this.enemies.getChildren().forEach((enemy) => {
      enemy.update();
    });
  }

  increaseScore(points) {
    this.score += points;
    this.scoreText.setText("Score: " + this.score);
  }

  // Call this method when the player loses a life
  loseLife() {
    console.log("Lose Life");
    this.lives -= 1;
    this.livesText.setText("Lives: " + this.lives);

    if (this.lives <= 0) {
      this.physics.pause();

      // Display "GAME OVER" message
      const camera = this.cameras.main;
      const centerX = camera.centerX;
      const centerY = camera.centerY;
      this.sound.play("death");
      this.end = true;
      

      this.add
        .text(centerX, centerY, "GAME OVER", { fontSize: "32px", fill: "#fff" })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setScale(1 / camera.zoom);
      const finalScore = this.score * this.lives + this.remainingTime;

      this.player.setVelocity(0, 0);
      this.player.hasFallen = false;
      this.end = true;

      // Optionally, wait a few seconds before going to the game over scene
      this.time.delayedCall(
        5000,
        () => {
          this.scene.start("GameOverScene", { score: finalScore });
        },
        [],
        this
      );
    } else {
      this.player.body.enable = false;
      this.player.setTint(0xff0000); // Apply a red tint to indicate damage
      this.sound.play("death");

      // Create a blinking effect
      let blinkCount = 0;
      this.player.visible = false; // Start with the player invisible
      let blinkEvent = this.time.addEvent({
        delay: 150, // Blink every 150ms
        callback: () => {
          this.player.visible = !this.player.visible;
          blinkCount++;
          if (blinkCount >= 6) {
            blinkEvent.remove();
            this.player.visible = true; // Ensure player is visible after blinking
            this.player.clearTint(); // Remove the tint
            this.player.body.enable = true; // Re-enable player physics

            // Teleport the player back to the specified location
            this.player.setPosition(50, 300);
            this.player.setVelocity(0, 0);
            this.player.hasFallen = false;
          }
        },
        callbackScope: this,
        loop: true,
      });
    }
  }

  //Function called when Tomato is picked up
  collectTomato(player, tomato) {
    tomato.disableBody(true, true); // This hides and deactivates the tomato
    this.increaseScore(10); // Increase the score by 10, for example
    this.sound.play("pickup");
  }

  //Checks if Game has Ended
  onLevelComplete() {
    this.physics.pause();
    this.end = true;

    // Display "Level Complete" message
    const camera = this.cameras.main;
    const centerX = camera.centerX;
    const centerY = camera.centerY;

    // Display "Level Complete" message
    const levelCompleteText = this.add
      .text(centerX, centerY, "Level Complete", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setScrollFactor(0); // Ensure the text isn't affected by camera zoom or scroll

    levelCompleteText.setScale(1 / camera.zoom);

    const finalScore = this.score * this.lives + this.remainingTime;
    // Wait for 5 seconds before moving to the next level or restarting
    this.time.delayedCall(
      5000,
      () => {
        // Replace 'NextLevelScene' with the key of the next level scene or use 'this.scene.restart()' to restart the current level
        this.scene.start("GameOverScene", { score: finalScore });
      },
      [],
      this
    );
  }

  //Function that handles Enemy Collision
  handlePlayerEnemyCollision(player, enemy) {
    if (this.isLoseLifeEnabled) {
      console.log("Hit Enemy");
      // Example: Player loses a life
      this.loseLife();
    }
  }

  handleEnemyDefeat(x, y, points, color) {
    // Update the score
    this.score += points;
    this.scoreText.setText("Score: " + this.score);
    this.sound.play("kill");

    // Create a text object at the enemy's position to display the points
    const pointsText = this.add.text(x, y, "+" + points, {
      fontSize: "8px",
      fill: "#fff",
    });
    pointsText.setOrigin(0.5, 0.5);

    // Create a fade-out effect for the points text
    this.tweens.add({
      targets: pointsText,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: "Power1",
      onComplete: () => {
        pointsText.destroy();
      },
    });
  }
}
