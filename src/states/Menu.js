/* globals ButtonGroup */
//In later changes I may want to create a list of buttons rather than store each individually
//It may be nice to have something more dynamic

import sunset from 'filters/menuFilter.js';
import ButtonGroup from 'ButtonGroup.js';

class Menu extends Phaser.State {

  preload() {
    window.game.load.shader('menuShader', 'shaders/menuShader.frag');
  }

  create() {
    window.game.stage.backgroundColor = '#FFFFFF';
    window.game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
    /*Apply filter to image in background*/
    var bdbm = window.game.make.bitmapData(window.game.width, window.game.height); //have to use this so the image has a texture
    this.backDrop = window.game.add.image(0, window.game.height*0.5, bdbm);
    this.backDrop.anchor.setTo(0.0, 0.5);
    this.backDrop.width = window.game.width;
    this.backDrop.height = window.game.height;
    this.backDrop.scale.y = -1; //when screenshot is taken it will be upside down so we flip it
    this.backDropFilter = window.game.add.filter('sunset', window.game.width, window.game.height);
    this.backDrop.filters = [this.backDropFilter];
    
    //draw title text
    this.titleText = window.game.add.text((window.game.width * 0.5 - 64) * 0.5, (window.game.height * 0.5 - 70) * 0.61, 'POTENTIAL FORTNIGHT');
    this.titleText.anchor.setTo(0.5, 0.5);
    this.titleText.fontSize = 30;
    this.titleText.fill = 'white';
    this.titleText.alpha = 0.5;
    // make menu buttons
    this.drawMain();
  }

  update() {
    this.backDropFilter.update(window.game.input.activePointer);
  }

  render() {
    
  }

  drawMain() {
    //make buttons and initialize their functions
    this.mainBtns = new ButtonGroup(this,
                                    window.game.world.centerX, window.game.world.centerY,
                                    [{name: 'START',
                                      x: 0,
                                      y: -20,
                                      anchor: [0.5, 0.5],
                                      callback() {window.game.state.start('Cutscene');}},
                                     {name: 'OPTIONS',
                                      x: 0,
                                      y: 20,
                                      anchor: [0.5, 0.5],
                                      callback: this.optionMenuToggle}]);

    this.optionBtns = new ButtonGroup(this,
                                      window.game.world.centerX, window.game.world.centerY,
                                      [{name: 'FULLSCREEN',
                                        x: 0,
                                        y: -60,
                                        anchor: [0.5, 0.5],
                                        callback: this.fullscreenToggle},
                                       {name: 'SOUND: ' + (window.game.sound.mute ? 'OFF':'ON'),
                                        x: 0,
                                        y: -20,
                                        anchor: [0.5, 0.5],
                                        callback: function(target) {
                                          window.game.sound.mute = window.game.sound.mute === false;
                                          target.setText('SOUND: '+ (window.game.sound.mute ? 'OFF':'ON'));
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
  }

  //functonality for the fullscreen button
  fullscreenToggle() {
    if (window.game.scale.isFullScreen) {
      this.resizeGame(1000, 600);
      window.game.scale.stopFullScreen();
    } else {
      this.resizeGame(screen.width, screen.height);
      window.game.scale.startFullScreen();   
    }
  }

  //toggles between regular menu and options menu
  optionMenuToggle() {
    if (this.menuState === 'MAIN') {
      this.backDropFilter.update({y: window.game.height*Math.random()}); //put sun at random location
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
  }

  // called in order to resize the window.game window, used with fullscreen
  resizeGame(w, h) {
    window.game.scale.setGameSize(w, h);
    this.backDropFilter.setResolution(window.game.width, window.game.height);
    this.backDrop.width = window.game.width;
    this.backDrop.height = window.game.height;
    this.titleText.position.setTo((window.game.width * 0.5 - 64) * 0.5, (window.game.height * 0.5 - 70) * 0.61);

    this.mainBtns.position.setTo(window.game.world.centerX, window.game.world.centerY);
    this.optionBtns.position.setTo(window.game.world.centerX, window.game.world.centerY);
  }
};

export default Menu
