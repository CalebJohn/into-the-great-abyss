/* globals ButtonGroup, WorldMap, SceneGenerator, utils, planetData, TextGroup */
var LevelOne = function () {
  this.baseBtns = null;
  this.baseData = null;
  this.map = null;
  this.returnBtn = null;
  this.sceneBtn = null;
  this.scene = null;
  this.backgroundImg = null;
  this.activeSector = null;
  this.noBase = null;
};

LevelOne.prototype = {

  preload: function() {
    game.state.backgroundColor = '#000000';
    game.load.shader('sceneShader', 'assets/filters/shaders/sceneShader.frag');
    game.load.script('sceneFilter', 'assets/filters/sceneFilter.js');
    game.load.script('BlurX', 'assets/filters/BlurX.js');
    game.load.script('BlurY', 'assets/filters/BlurY.js');
    //these stay with levelone instead of base because they need access to callback functions
    this.returnBtn = {name: 'Return to Map',
                      x: game.world.width + 10,
                      y: 10,
                      callback: this.toggleView};
    this.sceneBtn = {name: 'Generate Scene',
                      x: game.world.width * 2 - 10,
                      y: game.world.height - 10,
                      anchor: [1.0, 1.0],
                      callback: this.drawScene};
  },

  // TODO : This needs to be re-written to not destroy the buttons everytime
  updateButtons: function(sector) {
    this.activeSector = sector;
    var children = this.baseBtns.children;
    for (var i = 0; i < children.length; i++) {
      if ((children[i] != this.map)) {
        children[i].destroy();
      }
    }

    this.baseData = sector.base.infoDisplay || this.noBase; 
    //this is a bit hacky but it fixes an issue with displaying buttons when there is no base
    if (this.baseData != this.noBase) {
      this.baseBtns = new ButtonGroup(this, 0, 0, sector.base.buttons);
      this.baseBtns.makeButton(this, this.sceneBtn);
    } else {
      this.baseBtns = new ButtonGroup(this, 0, 0, [this.sceneBtn]);
    }
    this.baseBtns.add(this.scene);
    this.baseBtns.makeButton(this, this.returnBtn);
    this.baseBtns.add(this.map);
  },

  toggleView: function() {
    var groupPos = this.baseBtns.x === 0 ? -game.world.width : 0;

    game.add.tween(this.baseBtns).to({x: groupPos}, 700, Phaser.Easing.Quadratic.In, true);
    var dataGroupPos = this.baseData.x === 0 ? -game.world.width : 0;

    game.add.tween(this.baseData).to({x: dataGroupPos}, 700, Phaser.Easing.Quadratic.In, true);
  
  },

  drawScene: function() {
    if (!this.scene.visible) {
      var blurX = game.add.filter('BlurX');
      var blurY = game.add.filter('BlurY');

      this.backgroundImg.filters = [blurX];//could add blurY both look cool
      this.baseBtns.filters = [blurX];
      this.scene.remake();
      game.world.bringToTop(this.scene);
      this.scene.visible = true;
      this.baseBtns.toggleFreeze(this.sceneBtn);
    } else {
      this.scene.visible = false;
      this.backgroundImg.filters = null;
      this.baseBtns.toggleFreeze(this.sceneBtn);

      this.baseBtns.filters = null;
    }
  },

  create: function() {
    this.backgroundImg = game.add.image(0, 0);
    this.backgroundImg.texture = PIXI.Texture.fromCanvas(game.cache.getCanvas('background'));
    this.backgroundImg.width = game.width;
    this.backgroundImg.height = game.height;

    this.map = new WorldMap(game.world.centerX, game.world.centerY, this);
    
    this.baseBtns = new ButtonGroup(this, 0, 0, [this.returnBtn]);
    this.scene = new SceneGenerator('sceneFilter', game.width * 0.75, game.height * 0.75);
    this.baseBtns.add(this.map);
    //this.baseBtns.add(this.scene);    

     //I dont love this but it is the easiest solution for now
    this.noBase = new TextGroup(this, 0, 0, [{name: 'No Base in this Sector',
                                              x: 150 + game.world.width,
                                              y: 100,
                                              anchor: [0.0, 0.0]}]);

    utils.transitions.fadeIn(game, 1500);
  },

  update: function() {
    // TODO only update current sector here
    //    will have to wait until we have the update function decoupled from framerate
    for (var i = 0; i < planetData.mapSize; i++) {
      for (var j = 0; j < planetData.mapSize; j++) {
        var sec = planetData.getSector(i, j);
        if (sec.base != null) {
          sec.base.update();
        }
      }
    }

    if (this.activeSector != null) {
      if (this.activeSector.base.active) {
        this.activeSector.base.updateText();
      }
    }
  },

  render: function() {

  }
};
