class HelpScene extends Phaser.Scene {
  constructor() {
    super("HelpScene");
  }

  preload() {}

  create() {
    // Set the background color
    this.cameras.main.setBackgroundColor("0x000000"); // This is black

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
    bottomBorder.fillRect(
      0,
      canvasHeight - borderWidth,
      canvasWidth,
      borderWidth
    );

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
    rightTopHalfBorder.fillRect(
      canvasWidth - borderWidth,
      0,
      borderWidth,
      halfHeight
    );

    // Draw the bottom half of the right border (yellow)
    const rightBottomHalfBorder = this.add.graphics();
    rightBottomHalfBorder.fillStyle(topAndBottomHalfBorderColor, 1);
    rightBottomHalfBorder.fillRect(
      canvasWidth - borderWidth,
      halfHeight,
      borderWidth,
      halfHeight
    );

    // Add text with the game controls
    let helpText =
      "Use the ARROW keys to move the character.\n" +
      "Press UP to jump.\n" +
      "Press Space to Attack\n" +
      "Reach the end of the map.";
    let textStyle = {
      font: "20px Arial",
      fill: "#ffffff",
      align: "center",
      lineSpacing: 5,
    };
    let text = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      helpText,
      textStyle
    );
    text.setOrigin(0.5); // Center the text

    //Blinking Text to notify User to Continue
    let insertCoinText = this.add.text(
      config.width / 2,
      config.height / 2 + 100,
      " Press Space to Continue",
      { font: '20px "Press Start 2P"', fill: "#ff0000" }
    );

    //Added Text Event
    insertCoinText.setOrigin(0.5, 0.5);
    this.time.addEvent({
      delay: 500, // Blinking interval in milliseconds
      callback: () => {
        insertCoinText.visible = !insertCoinText.visible;
      },
      loop: true,
    });

    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keySpace)) {
      this.sound.play("buttonPress");
      this.scene.start("playScene");
    }
  }
}
