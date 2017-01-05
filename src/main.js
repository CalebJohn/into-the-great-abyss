/* globals Menu, LevelOne, PlanetData */

var game = new Phaser.Game(1000, 600, Phaser.Auto, '');
var planetData = null;
var resourceNames = ["Metal", "Rock", "Liquid", "Wood", "Plant", "Gas"];
var rcrs = {Metal:0, Rock:1, Liquid:2, Wood:3, Plant:4, Gas:5};

var Main = function() {};

Main.prototype = {

  preload: function() {
    game.load.script('menu', 'src/states/Menu.js'); 
    game.load.script('levelone', 'src/states/LevelOne.js'); 
    game.load.script('utils', 'src/utils.js');
    game.load.script('archetypes', 'src/archetype.js');
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
