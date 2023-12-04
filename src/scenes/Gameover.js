class Gameover extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  preload() {
    this.load.audio("number", "assets/Audio/number.wav");
  }

  init(data) {
    // Get the score from the passed data
    this.finalScore = data.score;
  }

  create() {
    this.scoreTickSound = this.sound.add("number", {
      volume: 0.5,
      loop: false,
    });
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Set the background color
    this.cameras.main.backgroundColor.setTo(0, 0, 0);

    // Display "Game Over" text
    this.add
      .text(centerX, centerY - 80, "Game Over", {
        fontSize: "32px",
        fill: "#FFF",
      })
      .setOrigin(0.5);

    // Display "Score" text
    this.add
      .text(centerX, centerY - 40, "Score", { fontSize: "28px", fill: "#FFF" })
      .setOrigin(0.5);

    // Initialize the score text to "0"
    this.currentScore = 0; // Start score
    this.finalScore = this.finalScore; // Final score to reach
    this.scoreIncrement = 1; // How much to increment each frame
    this.scoreAnimationComplete = false; // Flag to check if animation is complete

    // Create score text
    this.scoreText = this.add
      .text(centerX, centerY, "0", { fontSize: "40px", fill: "#FFD700" })
      .setOrigin(0.5);

    // Add "Press Space to go back to main scene" text - All the way at the buttom - Blinking
    this.add
      .text(centerX, 380, "Press Space to Continue", {
        fontSize: "24px",
        fill: "#FFF",
      })
      .setOrigin(0.5);

    if (this.finalScore > this.registry.get("highScore")) {
      this.registry.set("highScore", this.finalScore);
    }

    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keySpace)) {
      //this.sound.play('buttonPress');
      this.scene.start("MenuScene");
    }

    if (!this.scoreAnimationComplete) {
      this.currentScore += this.scoreIncrement;

      if (this.currentScore >= this.finalScore) {
        this.currentScore = this.finalScore; // Ensure it doesn't exceed final score
        this.scoreAnimationComplete = true; // Stop the animation
      }
      this.scoreTickSound.play();

      this.scoreText.setText(Math.round(this.currentScore).toString());
    }
  }
}
