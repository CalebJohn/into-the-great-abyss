/* globals planetData, randomTexture, noise, mix, roundTo */

var WorldGenerator = function () {
  this.isFinished = false;
};

WorldGenerator.prototype = {
  generateWorld: function(){
    console.log("generator started!");
    noise.seed(Math.random());
    planetData.generateMap();
    game.cache.addBitmapData('randomTex', randomTexture());
    /* generate a  bitmap to use as a fancy background image in the level */
    /* image is a quarter of the screen size because we do not need high-res */
    var bmd = game.make.bitmapData(window.game.width * 0.5, window.game.height * 0.5);
    var h, c, s;
    for (var x = 0; x < bmd.width; x++) {
      for (var y = 0; y < bmd.height; y++) {
        h = roundTo(noise.fbm2(x * 0.01, y * 0.01, 8) * ((y + 1) / bmd.height), 0.15 * ((y + 1) / bmd.height));
        c = mix(planetData.waterHue, planetData.landHue, Math.sqrt(h));
        s = 0.3 * c.r + 0.6 * c.g + 0.1 * c.b;
        c = mix({r:s, g:s, b:s}, c, 0.5);
        bmd.pixels[y * bmd.width + x] = Phaser.Color.packPixel(c.r, c.g, c.b, 255);
      }
    }

    bmd.context.putImageData(bmd.imageData, 0, 0);
    bmd.dirty = true;
    game.cache.addBitmapData('background', bmd);
    
    console.log("generator finished!");
    this.isFinished = true;
  }
};
