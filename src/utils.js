//Utility Functions
randomTexture = function() {
  var tex = new Array(256);
    for (var i = 0; i < 256; i++) {
      tex[i] = new Array(256);
      for (var j = 0; j< 256; j++) {
        tex[i][j] = {r:0, g:0, b:0};
      }
    }
  var bmd = game.make.bitmapData(256, 256);
  var alpha = 0;
  var red = 0;
  var green = 0;
  var blue = 0;
    for (var x = 0; x < bmd.width; x++) {
      for (var y = 0; y < bmd.height; y++) {
      tex[x][y].r = Math.random()*255;
      tex[x][y].b = Math.random()*255;
      }
    }
    blue = 0;
    red = 0;
    for (var x = 0; x < bmd.width; x++) {
      for (var y = 0; y < bmd.width; y++) {
        var x2 = (x-37) & 255;
        var y2 = (y-17) & 255;
        
        tex[x][y].g = tex[x2][y2].r;
        
       
      }
    }
    for (var x = 0; x < bmd.width; x++) {
      for (var y = 0; y < bmd.height; y++) {
        alpha = 255;
        red = tex[x][y].r;
        green = tex[x][y].g;
        blue = tex[x][y].b;
        bmd.pixels[y * bmd.width + x] = (alpha << 24) | (blue << 16) | (green << 8) | red;
      }
    }
  bmd.context.putImageData(bmd.imageData, 0, 0);
  bmd.dirty = true;
  return bmd;
};

smoothstep = function(a, b, c) {
  var t = Math.max(Math.min((c - a) / (b - a), 1.0), 0.0);
    return t * t * (3.0 - 2.0 * t);
};