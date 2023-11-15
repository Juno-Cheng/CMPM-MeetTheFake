class Gameover extends Phaser.Scene {
    constructor() {
        super('GameOverScene'); 
    }

    init(data) {
        // Get the score from the passed data
        this.finalScore = data.score;
    }

    create() {
        // Set the background color
        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
        this.background.setOrigin(0, 0);

        // Add "Game Over" text
        let gameOverText = "Game Over";
        let gameOverStyle = { font: '40px Arial', fill: '#ffffff', align: 'center' };
        let gameOverTextObj = this.add.text(config.width / 2, config.height / 2 - 60, gameOverText, gameOverStyle);
        gameOverTextObj.setOrigin(0.5);

        // Add the score text
        let scoreText = `Your Score: ${this.finalScore}`;
        let scoreStyle = { font: '32px Arial', fill: '#ffffff', align: 'center' };
        let scoreTextObj = this.add.text(config.width / 2, config.height / 2, scoreText, scoreStyle);
        scoreTextObj.setOrigin(0.5);

        // Create a 'Restart' button
        let restartButton = this.add.text(config.width / 2, config.height / 2 + 60, 'Restart', { font: '24px Arial', fill: '#ff0' }); 
        restartButton.setOrigin(0.5);
        restartButton.setInteractive({ useHandCursor: true });
        restartButton.on('pointerdown', () => this.scene.start('playScene')); 

        let mainMenuButton = this.add.text(config.width / 2, config.height / 2 + 100, 'Main Menu', { font: '24px Arial', fill: '#ff0' });
        mainMenuButton.setOrigin(0.5);
        mainMenuButton.setInteractive({ useHandCursor: true });
        mainMenuButton.on('pointerdown', () => {
            this.sound.play('clickSound');
            this.scene.start('MenuScene');
        });   
    }
}


