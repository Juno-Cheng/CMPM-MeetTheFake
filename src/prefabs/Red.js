class Red extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        this.setScale(1, 1);
        
        // Adding the enemy to the scene
        scene.add.existing(this);  // necessary for displaying the texture
        scene.physics.add.existing(this);  // necessary for physics to act on the sprite

        // Player physics properties. Adjust the body settings here as needed
        this.setCollideWorldBounds(true); // Enemy cannot move out of the game world

        this.body.setSize(this.width * 1, this.height * 1); 
        //this.body.setOffset(this.width * 0.1, this.height * 1); 

        // Initialize player properties from global variables
        this.moveSpeed = 10;

        //Add Attack

    }
    

}