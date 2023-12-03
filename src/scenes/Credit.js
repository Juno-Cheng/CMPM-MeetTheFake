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
            "Game Design: Your Name",
            "Programming: Your Name",
            "Artwork: Your Name",
            "Music: Your Name",
            "Special Thanks: Your Name"
        ];

        creditsText.forEach((line, index) => {
            this.add.text(centerX, 150 + index * 30, line, { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        });

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

        // Optionally, you can add some background music or sound for the credits screen
    }

    update() {
        // Check for spacebar press to return to menu
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start('MenuScene'); // Replace 'MenuScene' with the key of your main menu scene
        }
    }
}

// Make sure to add this scene to your game configuration
