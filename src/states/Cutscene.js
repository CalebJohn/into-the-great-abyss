/* globals WorldGenerator */
import WorldGenerator from 'WorldGenerator.js'

class Cutscene extends Phaser.State {

  beginCutscene (){
    // All the code in this function replace with actual cutscene
    var backgroundBmd = game.add.bitmapData(game.width, game.height);
    var grd = backgroundBmd.context.createLinearGradient(0, 0, game.width, game.height);
    grd.addColorStop(0, "rgb(200, 50, 50)");
    grd.addColorStop(0.3, "rgb(200, 0, 75)");
    grd.addColorStop(1, "rgb(200, 0, 150)");
    backgroundBmd.context.fillStyle = grd;
    backgroundBmd.context.fillRect(0, 0, game.width, game.height); 
    game.add.sprite(0, 0, backgroundBmd);
    
    var loader = game.add.sprite(10, 10, 'loadingImage');
    this.cutscene = loader.animations.add('load', [0, 1, 2], 1, false); 
    this.cutscene.play('load');
  }

  preload (){
    // Needed for Cutscene
    game.load.spritesheet('loadingImage', 'images/loadingImage.png', 270, 90, 3);

    game.load.image('fadeButton', 'images/fadeButton.png');
  }

  create (){
    this.generator = new WorldGenerator();
    this.beginCutscene();
    this.generator.generateWorld();
  }

  update (){
    if(this.cutscene.isFinished && this.generator.isFinished){
      game.state.start('LevelOne');
    }
  }

  render (){}
};

export default Cutscene;
