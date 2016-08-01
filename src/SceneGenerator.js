/*Object used for generating and presenting visual scenes*/
var SceneGenerator = function(filterName, width, height) {
  Phaser.Group.call(this, game);
  this.width = width;
  this.height = height;
  this.filter = filterName;
  this.position.setTo(game.world.width*1.25,game.world.height*0.25);
  this.texture = PIXI.Texture.fromCanvas(game.cache.getCanvas('randomTex'));
  this.visible = false;

  this.scene  = game.add.filter(filterName, width, height * 2.0, this.texture, Math.random() * 1000, Math.random() * 1000);

  this.inView = game.make.image();
  this.inView.width = width;
  this.inView.height = height;
  this.inView.filters = [this.scene];

  this.add(this.inView);
    
};

SceneGenerator.prototype = Object.create(Phaser.Group.prototype);
SceneGenerator.prototype.constructor = SceneGenerator;

SceneGenerator.prototype.remake = function() {
  this.scene.destroy();
  this.inView.filters = [];
  this.scene  = game.add.filter(this.filter, this.width, this.height * 2.0, this.texture, Math.random() * 1000, Math.random() * 1000);
  this.inView.filters = [this.scene];
};

SceneGenerator.prototype.add = function() {

};


