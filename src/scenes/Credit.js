//Template Copied from "Title"
class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene'); // This refers to the identifier for this scene
    }

    create() {
        // Set background color
        this.cameras.main.backgroundColor.setTo(0, 0, 0); // Black background

        // Add Credits title text
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        this.add.text(centerX, 100, 'Credits', { font: '32px Arial', fill: '#ffffff' }).setOrigin(0.5);

        // Add credits content here
        const creditsText = [
            "Game/Art/Audio Design: Jonathan Cheng",
            "Artwork: Aseprite",
            "Music: Zapsplat",
        ];

        creditsText.forEach((line, index) => {
            this.add.text(centerX, 150 + index * 30, line, { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        });

        //Add logos

        // Add "Press Space to return to menu" text at the bottom of the screen
        let returnText = this.add.text(centerX, this.cameras.main.height - 50, 'Press Space to return to menu', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

        // Make the return text blink
        this.time.addEvent({
            delay: 500, // Blinking interval in milliseconds
            callback: () => {
                returnText.visible = !returnText.visible;
            },
            loop: true
        });

        // Add spacebar key listener
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Add Borders
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

    }

    update() {
        // Check for spacebar press to return to menu
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start('MenuScene'); 
        }
    }
}

