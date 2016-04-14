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
    var canvas = document.createElement("canvas");
    canvas.width = game.width * 0.5;
    canvas.height = game.height * 0.5;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    var data = imageData.data;

    var h, c, s, i;
    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        h = roundTo(noise.fbm2(x * 0.01, y * 0.01, 8) * ((y + 1) / canvas.height), 0.15 * ((y + 1) / canvas.height));
        c = mix(planetData.waterHue, planetData.landHue, Math.sqrt(h));
        s = 0.3 * c.r + 0.6 * c.g + 0.1 * c.b;
        c = mix({r:s, g:s, b:s}, c, 0.5);
        i = 4 * (y * canvas.width + x);
        data[i] = c.r;
        data[i + 1] = c.g;
        data[i + 2] = c.b;
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    game.cache.addCanvas('background', canvas, ctx);
    
    console.log("generator finished!");
    this.isFinished = true;
  }
};
