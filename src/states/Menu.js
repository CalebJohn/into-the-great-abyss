/* globals window */

//In later changes I may want to create a list of buttons rather than store each individually
//It may be nice to have something more dynamic
var Menu = function () {
  this.backDropFilter = null;
  this.backDrop = null;
  this.titleText = null;
  this.startButton = null;
  this.optionButton = null;
  this.fullscreenButton = null;
  this.muteButton = null;
  this.seedButton = null;
  this.returnButton = null;

};

Menu.prototype = {
  preload: function() {
    window.game.load.script('sunset', 'assets/shaders/MenuShader.js');
  },

  create: function() {
    window.game.stage.backgroundColor = '#FFFFFF';
    window.game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
    //load Filter
    //this.initMenuBackground();
    //Apply filter to image in background
    this.backDrop = window.game.add.image();
    this.backDrop.width = window.game.width;
    this.backDrop.height = window.game.height;
    this.backDropFilter = window.game.add.filter('sunset', window.game.width, window.game.height);
    this.backDrop.filters = [this.backDropFilter];
    
    //draw title text
    this.titleText = window.game.add.text((window.game.width * 0.5 - 64) * 0.5, (window.game.height * 0.5 - 70) * 0.61, 'POTENTIAL FORTNIGHT');
    this.titleText.anchor.setTo(0.5, 0.5);
    this.titleText.fontSize = 30;
    this.titleText.fill = 'white';
    this.titleText.alpha = 100;
    // make menu buttons
    this.drawMain();
  },

  update: function() {
    this.backDropFilter.update(window.game.input.activePointer);
  },

  render: function() {
    
  },

  drawMain: function() {
    //make buttons and initialize their functions
    this.startButton = this.makeButton(window.game.world.centerX, window.game.world.centerY - 20, 'START');
    this.startButton.events.onInputDown.add(function() {window.game.state.start('Cutscene');});
    this.optionButton = this.makeButton(window.game.world.centerX, window.game.world.centerY + 20, 'OPTIONS');
    this.optionButton.events.onInputDown.add(this.toggleMenu, this);
    this.fullscreenButton = this.makeButton(window.game.world.centerX, window.game.world.centerY - 60, 'FULLSCREEN');
    this.fullscreenButton.visible = false;
    this.fullscreenButton.events.onInputDown.add(this.fullscreenToggle, this);
    this.muteButton = this.makeButton(window.game.world.centerX, window.game.world.centerY - 20, 'SOUND: ' + (window.game.sound.mute ? 'OFF':'ON'));
    this.muteButton.visible = false;
    this.muteButton.events.onInputDown.add(function(target) {window.game.sound.mute = window.game.sound.mute === false; target.setText('SOUND: '+ (window.game.sound.mute ? 'OFF':'ON'));});
    this.seedButton = this.makeButton(window.game.world.centerX, window.game.world.centerY + 20, 'SEED: ');
    this.seedButton.visible = false;
    this.returnButton = this.makeButton(window.game.world.centerX, window.game.world.centerY + 60, 'RETURN');
    this.returnButton.visible = false;
    this.returnButton.events.onInputDown.add(this.toggleMenu, this);
  },

  //generic button creator, initializes buttons with standard formatting
  makeButton: function(x, y, name) {
    var button = window.game.add.text(x, y, name);
    button.anchor.setTo(0.5, 0.5);
    button.fontSize = 25;
    button.fill = 'white';
    button.inputEnabled = true;
    button.events.onInputOver.add(function(target) {target.alpha = 150;});
    button.events.onInputOut.add(function(target) {target.alpha = 1;});
    return button;
  },

  //functonality for the fullscreen button
  fullscreenToggle: function() {
    if (window.game.scale.isFullScreen)
    {
        this.resizeGame(1000, 600);
        
        window.game.scale.stopFullScreen();
    }
    else
    {
        
       this.resizeGame(window.screen.width, window.screen.height);
        window.game.scale.startFullScreen();
        
        
    }
  },

  //toggles between regular menu and options menu
  toggleMenu: function() {
    this.startButton.visible = this.startButton.visible === false;
    this.optionButton.visible = this.optionButton.visible === false;
    this.fullscreenButton.visible = this.fullscreenButton.visible === false;
    this.muteButton.visible = this.muteButton.visible === false;
    this.seedButton.visible = this.seedButton.visible === false;
    this.returnButton.visible = this.returnButton.visible === false;
  },

  // called in order to resize the game window, used with fullscreen
  resizeGame: function(w, h) {
    window.game.scale.setGameSize(w, h);
    this.backDropFilter.setResolution(window.game.width, window.game.height);
    this.backDrop.width = window.game.width;
    this.backDrop.height = window.game.height;
    this.titleText.position.setTo((window.game.width * 0.5 - 64) * 0.5, (window.game.height * 0.5 - 70) * 0.61);
    this.startButton.position.setTo(window.game.world.centerX, window.game.world.centerY - 20);
    this.optionButton.position.setTo(window.game.world.centerX, window.game.world.centerY + 20);
    this.fullscreenButton.position.setTo(window.game.world.centerX, window.game.world.centerY - 60);
    this.muteButton.position.setTo(window.game.world.centerX, window.game.world.centerY - 20);
    this.seedButton.position.setTo(window.game.world.centerX, window.game.world.centerY + 20);
    this.returnButton.position.setTo(window.game.world.centerX, window.game.world.centerY + 60);
  }
};