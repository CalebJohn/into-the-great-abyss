// Globals
window.worldData
window.game = new Phaser.Game(1000, 600, Phaser.Auto, '');

startGame();

function startGame() {
    // game.state gets the StateManager object for the game (naming is a bit misleading)
    game.state.add('Menu', require('./states/Menu')); 
    game.state.add('Cutscene', require('./states/Cutscene')); 
    game.state.add('LevelOne', require('./states/LevelOne'));

    game.state.start('Menu');
}