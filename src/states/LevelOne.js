/* globals GUIBuilder */
var LevelOne = function () {
  this.gui = null;
};

LevelOne.prototype = {

  preload: function() {
    game.stage.backgroundColor = '#444444';
    game.load.script('guiBuilder', 'src/guiBuilder.js');
  },

  toggleView: function(btn) {
    var group = btn.parent;
    var groupPos = group.x === 0 ? -game.world.width : 0;
    var btnRot = group.x === 0 ? -3 * Math.PI : 0;

    game.add.tween(group).to({x: groupPos}, 1200, Phaser.Easing.Quadratic.In, true);
    game.add.tween(btn).to({rotation: btnRot}, 1200, Phaser.Easing.Quadratic.In, true);
  },

  collectResources: function(btn) {
    // TODO : Put something here
    console.log(btn.text);
  },

  create: function() {
    this.gui = new GUIBuilder([{name: 'Mine Ore',
                                x: 100,
                                y: 100,
                                anchor: [0, 0.5],
                                callback: this.collectResources},
                               {name: 'Chop Trees',
                                x: 100,
                                y: 200,
                                anchor: [0, 0.5],
                                callback: this.collectResources},
                               {name: '⇀',
                                x: game.world.width,
                                y: game.world.centerY,
                                anchor: [1.6, 0.5],
                                callback: this.toggleView,
                                size: 48}]);
  },

  update: function() {

  },

  render: function() {

  }
};
