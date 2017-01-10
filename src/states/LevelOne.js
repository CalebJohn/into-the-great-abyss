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

  // TODO : This needs to be re-written to not destroy the buttons evertime
  updateButtons: function(sector) {
    this.activeSector = sector;
    var children = this.baseBtns.children;
    for (var i = 0; i < children.length; i++) {
      if ((children[i] != this.map)&&(children[i] != this.scene)) {
        children[i].destroy();
      }
    }

    this.baseData = sector.base.infoDisplay || this.noBase; 
    this.baseBtns = new ButtonGroup(this, 0, 0, sector.base.buttons);
    this.baseBtns.add(this.scene);
    this.baseBtns.makeButton(this, this.returnBtn);
    this.baseBtns.makeButton(this, this.sceneBtn);
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
      this.scene.remake();
      this.scene.visible = true;
    } else {
      this.scene.visible = false;
    }
  },

  create: function() {
    this.backgroundImg = game.add.image(0, 0);
    this.backgroundImg.texture = PIXI.Texture.fromCanvas(game.cache.getCanvas('background'));
    this.backgroundImg.width = game.width;
    this.backgroundImg.height = game.height;

    this.map = new WorldMap(game.world.centerX, game.world.centerY, this);
    this.scene = new SceneGenerator('sceneFilter', game.width * 0.5, game.height * 0.5);
    this.baseBtns = new ButtonGroup(this, 0, 0, [this.returnBtn]);
    this.baseBtns.add(this.map);
    this.baseBtns.add(this.scene);    

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
