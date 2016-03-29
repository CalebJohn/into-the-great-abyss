/* globals ButtonGroup */
//In later changes I may want to create a list of buttons rather than store each individually
//It may be nice to have something more dynamic
var Menu = function () {
  this.backDropFilter = null;
  this.backDrop = null;
  this.titleText = null;
  this.mainBtns = null;
  this.optionBtns = null;
  this.menuState = 'MAIN';
};

Menu.prototype = {
  preload: function() {
  	game.load.shader('menuShader', 'assets/filters/shaders/menuShader.frag');
    game.load.script('sunset', 'assets/filters/menuFilter.js');
    game.load.script('buttonGroup', 'src/ButtonGroup.js');
  },

  create: function() {
    game.stage.backgroundColor = '#FFFFFF';
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
    /*Apply filter to image in background*/
    this.backDrop = game.add.image();
    this.backDrop.width = game.width;
    this.backDrop.height = game.height;
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
  },

  update: function() {
    this.backDropFilter.update(game.input.activePointer);
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
                                      callback: function() {game.state.start('Cutscene');}},
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
      this.mainBtns.visible = false;
      this.optionBtns.visible = true;
      this.menuState = 'OPTIONS';
    } else if (this.menuState === 'OPTIONS') {
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
