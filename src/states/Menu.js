/* globals ButtonGroup */
//In later changes I may want to create a list of buttons rather than store each individually
//It may be nice to have something more dynamic
var Menu = function () {
  this.backDropFilter = null;
  this.backDrop = null;
  this.titleText = null;
  this.mainBtns = null;
  this.optionBtns = null;
  // this.sunPos = game.input.activePointer;
  this.sunPos = {y: game.height};
  this.sunrise = true;
  this.tween = null;
  this.menuState = 'MAIN';
};

Menu.prototype = {
  preload: function() {
    game.load.shader('menuShader', 'assets/filters/shaders/menuShader.frag');
    game.load.script('sunset', 'assets/filters/menuFilter.js');
    game.load.script('buttonGroup', 'src/ButtonGroup.js');

    game.load.script('WorldGenerator', 'src/WorldGenerator.js'); 
    // game.load.spritesheet('loadingImage', 'assets/loadingImage.png', 270, 90, 3);
    game.load.script('util', 'src/utils.js');
    game.load.script('sceneGenerator', 'src/SceneGenerator.js');
    game.load.script('noise', 'src/perlin.js');

    // Necessary for LevelOne
    game.load.script('buttonGroup', 'src/ButtonGroup.js');
    game.load.script('sectorData', 'src/SectorData.js');
    game.load.script('worldMap', 'src/WorldMap.js');
    game.load.image('fadeButton', 'assets/fadeButton.png');
  },

  create: function() {
    game.stage.backgroundColor = '#000000';
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
    /*Apply filter to image in background*/
    var bdbm = game.make.bitmapData(game.width, game.height); //have to use this so the image has a texture
    this.backDrop = game.add.image(0, game.height*0.5, bdbm);
    this.backDrop.anchor.setTo(0.0, 0.5);
    this.backDrop.width = game.width;
    this.backDrop.height = game.height;
    this.backDrop.scale.y = -1; //when screenshot is taken it will be upside down so we flip it
    this.backDropFilter = game.add.filter('sunset', game.width, game.height);
    this.backDrop.filters = [this.backDropFilter];
    
    //draw title text
    this.titleText = game.add.text((game.width * 0.5 - 64) * 0.5, (game.height * 0.5 - 70) * 0.61, 'POTENTIAL FORTNIGHT');
    this.titleText.anchor.setTo(0.5, 0.5);
    this.titleText.fontSize = 30;
    this.titleText.fill = 'white';
    this.titleText.alpha = 0.5;
    // make menu buttons
    this.drawMain();

    this.mainBtns.alpha = 0;
    game.add.tween(this.mainBtns).to({alpha: 1},
                                    2000,
                                    Phaser.Easing.Linear.In,
                                    true);
    var tween = game.add.tween(this.sunPos).to({y: -50},
                                                2000,
                                                Phaser.Easing.Quadratic.In,
                                                true);
    tween.onComplete.add(function () {this.sunrise = false;}, this);

    this.generator = new WorldGenerator();
    tween.onComplete.add(this.generator.generateWorld, this.generator);
    // utils.runInBackground(this.generator.generateWorld, this.generator);
  },

  update: function() {
    var delta = (game.input.activePointer.y - this.sunPos.y) / 20;
    if (Math.abs(delta) > 1 && !this.sunrise) {
      this.sunPos.y += delta;
    }
    this.backDropFilter.update(this.sunPos);
  },

  render: function() {
    
  },

  drawMain: function() {
    //make buttons and initialize their functions
    this.mainBtns = new ButtonGroup(this,
                                    game.world.centerX, game.world.centerY,
                                    [{name: 'START',
                                      x: 0,
                                      y: -20,
                                      anchor: [0.5, 0.5],
                                      callback: this.startGame},
                                     {name: 'OPTIONS',
                                      x: 0,
                                      y: 20,
                                      anchor: [0.5, 0.5],
                                      callback: this.optionMenuToggle}]);

    this.optionBtns = new ButtonGroup(this,
                                      game.world.centerX, game.world.centerY,
                                      [{name: 'FULLSCREEN',
                                        x: 0,
                                        y: -60,
                                        anchor: [0.5, 0.5],
                                        callback: this.fullscreenToggle},
                                       {name: 'SOUND: ' + (game.sound.mute ? 'OFF':'ON'),
                                        x: 0,
                                        y: -20,
                                        anchor: [0.5, 0.5],
                                        callback: function(target) {
                                          game.sound.mute = game.sound.mute === false;
                                          target.setText('SOUND: '+ (game.sound.mute ? 'OFF':'ON'));
                                        }},
                                       {name: 'SEED: ',
                                        x: 0,
                                        y: 20,
                                        anchor: [0.5, 0.5]},
                                       {name: 'RETURN',
                                        x: 0,
                                        y: 60,
                                        anchor: [0.5, 0.5],
                                        callback: this.optionMenuToggle}]);
    this.optionBtns.visible = false;
  },

  //plays a simple animation and switches to cutsence state
  startGame: function() {
    this.sunPos = {y: this.sunPos.y};

    var tween = game.add.tween(this.sunPos).to({y: game.height},
                                                1500,
                                                Phaser.Easing.Exponential.Out,
                                                true);

    utils.transitions.fadeOut(game, 1500);

    tween.onComplete.add(function() {game.state.start('LevelOne');}, this);
  },

  //functonality for the fullscreen button
  fullscreenToggle: function() {
    if (game.scale.isFullScreen) {
      this.resizeGame(1000, 600);
      game.scale.stopFullScreen();
    } else {
      this.resizeGame(screen.width, screen.height);
      game.scale.startFullScreen();   
    }
  },

  //toggles between regular menu and options menu
  optionMenuToggle: function() {
    if (this.menuState === 'MAIN') {
      this.backDropFilter.update({y: game.height*Math.random()}); //put sun at random location
      this.backDrop.setTexture(this.backDrop.generateTexture()); //then take a snapshot and save it as the texture
      this.backDrop.filters = null; //then turn off the filter so it isnt running anymore

      this.mainBtns.visible = false;
      this.optionBtns.visible = true;
      this.menuState = 'OPTIONS';
    } else if (this.menuState === 'OPTIONS') {
      this.backDrop.filters = [this.backDropFilter];

      this.mainBtns.visible = true;
      this.optionBtns.visible = false;
      this.menuState = 'MAIN';
    }
  },

  // called in order to resize the game window, used with fullscreen
  resizeGame: function(w, h) {
    game.scale.setGameSize(w, h);
    this.backDropFilter.setResolution(game.width, game.height);
    this.backDrop.width = game.width;
    this.backDrop.height = game.height;
    this.titleText.position.setTo((game.width * 0.5 - 64) * 0.5, (game.height * 0.5 - 70) * 0.61);

    this.mainBtns.position.setTo(game.world.centerX, game.world.centerY);
    this.optionBtns.position.setTo(game.world.centerX, game.world.centerY);
  }
};
