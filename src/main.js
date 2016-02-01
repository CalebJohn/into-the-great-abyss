// Globals
window.game = new Phaser.Game(1000, 600, Phaser.Auto, '');

var Main = function() {};
var worldData;
// startGame();


Main.prototype = {

  preload: function() {
    game.load.script('menu', 'src/states/Menu.js'); 
    game.load.script('cutscene', 'src/states/Cutscene.js'); 
    game.load.script('levelone', 'src/states/LevelOne.js'); 
  },
  
  create: function() {
    // game.state gets the StateManager object for the game (naming is a bit misleading)
    game.state.add('Menu', Menu); 
    game.state.add('Cutscene', Cutscene); 
    game.state.add('LevelOne', LevelOne);

    // TODO : Add a splash screen
    game.state.start('Menu');
  }
};

game.state.add('Main', Main);
game.state.start('Main');
