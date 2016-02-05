"use strict";

var Cutscene = function () {
  this.generator = null;
  this.cutscene = null;
};

Cutscene.prototype = {

  beginCutscene: function() {
    // All the code in this function replace with actual cutscene
    var background_bmd = window.game.add.bitmapData(window.game.width, window.game.height);
    var grd = background_bmd.context.createLinearGradient(0, 0, window.game.width, window.game.height);
    grd.addColorStop(0, "rgb(200, 50, 50)");
    grd.addColorStop(0.3, "rgb(200, 0, 75)");
    grd.addColorStop(1, "rgb(200, 0, 150)");
    background_bmd.context.fillStyle = grd;
    background_bmd.context.fillRect(0, 0, window.game.width, window.game.height); 
    window.game.add.sprite(0, 0, background_bmd);
    
    var loader = window.game.add.sprite(10, 10, 'loadingImage');
    this.cutscene = loader.animations.add('load', [0, 1, 2], 1, false); 
    this.cutscene.play('load');
  },

  preload: function() {
    window.game.load.script('WorldGenerator', 'src/WorldGenerator.js'); 
    window.game.load.spritesheet('loadingImage', '../../assets/loadingImage.png', 270, 90, 3);
  },

  create: function() {
    this.generator = new WorldGenerator();
    this.beginCutscene();
    this.generator.generateWorld();
  },

  update: function() {
    if(this.cutscene.isFinished && this.generator.isFinished){
      window.game.state.start('LevelOne');
    }
  },

  render: function() {}
};
