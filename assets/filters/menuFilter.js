Phaser.Filter.sunset = function (game) {

    Phaser.Filter.call(this, game);
    this.fragmentSrc = game.cache.getShader('menuShader');

};

Phaser.Filter.sunset.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.sunset.prototype.constructor = Phaser.Filter.sunset;

Phaser.Filter.sunset.prototype.init = function (width, height) {
    this.setResolution(width, height);
};
