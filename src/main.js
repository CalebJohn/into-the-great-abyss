/* globals Menu, LevelOne, PlanetData */

var game = new Phaser.Game(1000, 600, Phaser.Auto, '');
var planetData = null;

var Main = function() {};

Main.prototype = {

  preload: function() {
    game.load.script('menu', 'src/states/Menu.js'); 
    game.load.script('levelone', 'src/states/LevelOne.js'); 
    game.load.script('planetData', 'src/PlanetData.js');
  },
  
  create: function() {
    // game.state gets the StateManager object for the game (naming is a bit misleading)
    game.state.add('Menu', Menu); 
    game.state.add('LevelOne', LevelOne);
    planetData = new PlanetData();
    // TODO : Add a splash screen
    game.state.start('Menu');
  }
};

game.state.add('Main', Main);
game.state.start('Main');
