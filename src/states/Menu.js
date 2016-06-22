/* globals ButtonGroup, WorldGenerator, utils */
//In later changes I may want to create a list of buttons rather than store each individually
//It may be nice to have something more dynamic
var Menu = function () {
  this.backDropFilter = null;
  this.backDrop = null;
  this.titleText = null;
  this.mainBtns = null;
  this.optionBtns = null;
  this.sunPos = {y: game.height};
  // true if the sun should follow the mouse
  this.followMouse = false;
  // Time it takes for the sun to rise (just before loading)
  this.riseTime = 2000;
  // Time it takes for the sun to lower before switching states
  this.settingTime = 5000;
  // This is how quickly the sun will follow the mouse
  // a larger number will follow slower, see the update function
  // for more information
  this.followFactor = 20;

  this.menuState = 'MAIN';
};

Menu.prototype = {
  preload: function() {
    game.load.shader('menuShader', 'assets/filters/shaders/menuShader.frag');
    game.load.script('sunset', 'assets/filters/menuFilter.js');
    game.load.script('buttonGroup', 'src/ButtonGroup.js');

    game.load.script('WorldGenerator', 'src/WorldGenerator.js'); 
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
    this.titleText = game.add.text((game.width * 0.5 - 64) * 0.5, (game.height * 0.5 - 70) * 0.61, 'PLEASE WAIT...');
    this.titleText.anchor.setTo(0.5, 0.5);
    this.titleText.fontSize = 30;
    this.titleText.fill = 'white';
    this.titleText.alpha = 0.5;
    // make menu buttons (They won't be visible yet)
    this.drawMain();
    this.initiateSunrise();
  },

  update: function() {
    // This is the mouse tracking code for the sun, it won't be called
    // during sunrise or sunset
    if (this.followMouse) {
      // This is the amount to move the sun towards the mouse cursor
      // because of the follow factor the movement of the sun towards
      // the cursor will slow down as it approaches, the larger the factor
      // the slower the sun will approach the cursor
      var delta = (game.input.activePointer.y - this.sunPos.y) / this.followFactor;

      // Only move the sun if the change would be more than 1 pixel
      // this makes the sun settle into position more smoothly but it
      // means that the sun can only settle within followFactor pixels
      // of the mouse cursor
      if (Math.abs(delta) > 1) {
        this.sunPos.y += delta;
      }
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
    
    this.mainBtns.alpha = 0;
    this.mainBtns.visible = false;
    this.optionBtns.visible = false;
  },

  // Triggers a sunrise
  initiateSunrise: function() {
    // Move the sun to the top of the screen
    // 50pixels was determined to be enough to hide the sun off screen
    var tween = game.add.tween(this.sunPos).to(
        {y: -50},
        this.riseTime,
        Phaser.Easing.Linear.In,
        true);

    tween.onComplete.add(function () {this.loadGame();}, this);
  },

  loadGame: function() {
    this.generator = new WorldGenerator();
    // tween.onComplete.add(this.generator.generateWorld, this.generator);
    this.generator.generateWorld();

    // Fade in the main game buttons
    this.mainBtns.visible = true;
    game.add.tween(this.mainBtns).to(
        {alpha: 1},
        500,
        Phaser.Easing.Linear.In,
        true);

    // Fades out the please wait message
    var tween = game.add.tween(this.titleText).to(
        {alpha: 0},
        200,
        Phaser.Easing.Linear.In,
        true);
    // Setting followMouse to true triggers the sun to follow the mouse
    // this is in the update code
    this.followMouse = true;

    // After the please wait has faded out, fade in the actual title
    tween.onComplete.add(function () {
      this.titleText.text = 'POTENTIAL FORTNIGHT';
        game.add.tween(this.titleText).to(
            {alpha: 1},
            1000,
            Phaser.Easing.Linear.In,
            true);
    }, this);
  },

  //plays a simple animation and switches to the main game state
  startGame: function() {
    this.followMouse = false;
    // Hide all text
    this.titleText.visible = false;
    this.mainBtns.visible = false;
    this.optionBtns.visible = false;

    // The sun will move down and off the screen
    var tween = game.add.tween(this.sunPos).to({y: game.height},
                                                this.settingTime,
                                                Phaser.Easing.Exponential.Out,
                                                true);

    utils.transitions.fadeOut(game, this.settingTime);

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
