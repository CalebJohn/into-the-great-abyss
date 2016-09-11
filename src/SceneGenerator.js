/*Object used for generating and presenting visual scenes*/
var SceneGenerator = function(filterName, width, height) {
  Phaser.Group.call(this, game);
  this.width = width;
  this.height = height;
  this.filter = filterName;
  this.position.setTo(game.world.width*0.125,game.world.height*0.125);
  this.texture = PIXI.Texture.fromCanvas(game.cache.getCanvas('randomTex'));
  this.visible = false;

  this.scene  = null;//game.add.filter(filterName, width, height * 2.0, this.texture, Math.random() * 1000, Math.random() * 1000);

  var bdbm = game.make.bitmapData(width, height); //have to use this so the image has a texture
  this.inView = game.make.image(0, height*0.5, bdbm);
  this.inView.anchor.setTo(0.0, 0.5);
  this.inView.scale.y = -1; //when screenshot is taken it will be upside down so we flip it

  this.add(this.inView);
    
};

SceneGenerator.prototype = Object.create(Phaser.Group.prototype);
SceneGenerator.prototype.constructor = SceneGenerator;

SceneGenerator.prototype.remake = function() {
  
  this.inView.filters = null;

  this.scene  = game.add.filter(this.filter, this.width, this.height * 2.0, this.texture, Math.random() * 1000, Math.random() * 1000);
  this.inView.filters = [this.scene];
  this.inView.setTexture(this.inView.generateTexture());
  this.inView.filters = null;
  this.scene.destroy(); //must destroy or game holds onto all filters//may be better to just update filter with uniforms?

};
SceneGenerator.prototype.present = function() {

};

/*SceneGenerator.prototype.add = function() {

};*/


