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
        this.cameras.main.backgroundColor.setTo(0, 0, 0);

        // Add "Enter Score" text:

        //Box to fill in name 

        //Letter Selection - Array of Buttons - With Enter Button which will save

        //List of Highscore

        //Press Space to go back to main scene
        
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            //this.sound.play('buttonPress');
            this.scene.start("menuScene");
          }
    }
        
}


