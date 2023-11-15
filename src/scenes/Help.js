class HelpScene extends Phaser.Scene {
    constructor() {
        super('HelpScene'); 
    }

    preload() {
        this.load.audio('clickSound', './assets/click.wav');
    }

    create() {
        this.clickSound = this.sound.add('clickSound');
        // Set the background color
        this.cameras.main.setBackgroundColor('0x000000'); // This is black

        // Add text with the game controls
        let helpText = "Use the ARROW keys to move the character.\n" +
                       "Press UP to jump.\n" +
                       "Avoid obstacles and try to run as far as possible.";
        let textStyle = { font: '20px Arial', fill: '#ffffff', align: 'center', lineSpacing: 5 };
        let text = this.add.text(this.scale.width / 2, this.scale.height / 2, helpText, textStyle);
        text.setOrigin(0.5); // Center the text

        // Create a 'Back to menu' button
        let backButton = this.add.text(50, 50, 'Back to Menu', { font: '24px Arial', fill: '#ff0' });
        backButton.setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => {
            this.sound.play('clickSound');
            this.scene.start('MenuScene');
        });  
    }
}
