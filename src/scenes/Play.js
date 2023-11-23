class Play extends Phaser.Scene {
    constructor() {
        super('playScene'); 
    }
    preload(){
        this.load.tilemapTiledJSON('map','assets/TileMap/Level1.json');
        this.load.image('tiles', 'assets/TileSet/TileMap.png');
        this.load.image('tomato', 'assets/TileSet/Spike.png')

        //Load Background

        //Load Player

    }
    
    create() {
        //const backgroundImage = this.add.image(0, 0,'background').setOrigin(0, 0);
        //backgroundImage.setScale(2, 0.8);

        //TileMap
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('customTileset', 'tiles');
        const platforms = map.createStaticLayer('Platforms', tileset, 0, 200);
        platforms.setCollisionByExclusion(-1, true);




        
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.sound.play('buttonPress');
            this.scene.start("menuScene");
          }
    }
        
}
