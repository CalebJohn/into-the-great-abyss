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
    game.load.script('sunset', 'assets/shaders/MenuShader.js');
  },

  create: function() {
  	game.stage.backgroundColor = '#FFFFFF';
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
  	//load Filter
  	//this.initMenuBackground();
  	//Apply filter to image in background
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
    this.titleText.alpha = 100;
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
  	this.startButton = this.makeButton(game.world.centerX, game.world.centerY - 20, 'START');
  	this.startButton.events.onInputDown.add(function() {game.state.start('Cutscene');});
  	this.optionButton = this.makeButton(game.world.centerX, game.world.centerY + 20, 'OPTIONS');
  	this.optionButton.events.onInputDown.add(this.toggleMenu, this);
  	this.fullscreenButton = this.makeButton(game.world.centerX, game.world.centerY - 60, 'FULLSCREEN');
  	this.fullscreenButton.visible = false;
    this.fullscreenButton.events.onInputDown.add(this.fullscreenToggle, this);
  	this.muteButton = this.makeButton(game.world.centerX, game.world.centerY - 20, 'SOUND: ' + (game.sound.mute ? 'OFF':'ON'));
  	this.muteButton.visible = false;
  	this.muteButton.events.onInputDown.add(function(target) {game.sound.mute = game.sound.mute === false; target.setText('SOUND: '+ (game.sound.mute ? 'OFF':'ON'));});
  	this.seedButton = this.makeButton(game.world.centerX, game.world.centerY + 20, 'SEED: ');
  	this.seedButton.visible = false;
  	this.returnButton = this.makeButton(game.world.centerX, game.world.centerY + 60, 'RETURN');
  	this.returnButton.visible = false;
  	this.returnButton.events.onInputDown.add(this.toggleMenu, this);
  },

  //generic button creator, initializes buttons with standard formatting
  makeButton: function(x, y, name) {
  	var button = game.add.text(x, y, name);
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
    if (game.scale.isFullScreen)
    {
        this.resizeGame(1000, 600);
        
        game.scale.stopFullScreen();
    }
    else
    {
        
       this.resizeGame(window.screen.width, window.screen.height);
        game.scale.startFullScreen();
        
        
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
    game.scale.setGameSize(w, h);
    this.backDropFilter.setResolution(game.width, game.height);
    this.backDrop.width = game.width;
    this.backDrop.height = game.height;
    this.titleText.position.setTo((game.width * 0.5 - 64) * 0.5, (game.height * 0.5 - 70) * 0.61);
    this.startButton.position.setTo(game.world.centerX, game.world.centerY - 20);
    this.optionButton.position.setTo(game.world.centerX, game.world.centerY + 20);
    this.fullscreenButton.position.setTo(game.world.centerX, game.world.centerY - 60);
    this.muteButton.position.setTo(game.world.centerX, game.world.centerY - 20);
    this.seedButton.position.setTo(game.world.centerX, game.world.centerY + 20);
    this.returnButton.position.setTo(game.world.centerX, game.world.centerY + 60);
  } = null    
};