/* globals Menu, Cutscene, LevelOne, PlanetData */

import Menu from 'states/Menu.js';
import Cutscene from 'states/Cutscene.js';
import LevelOne from 'states/LevelOne.js';
import PlanetData from 'PlanetData.js';

window.game = new Phaser.Game(1000, 600, Phaser.Auto, '');

var Main = function() {};

Main.prototype = {

  create: function() {
    // game.state gets the StateManager object for the game (naming is a bit misleading)
    game.state.add('Menu', Menu);
    game.state.add('Cutscene', Cutscene);
    game.state.add('LevelOne', LevelOne);
    window.planetData = new PlanetData();
    // TODO : Add a splash screen
    game.state.start('Menu');
  }
};

game.state.add('Main', Main);
game.state.start('Main');
