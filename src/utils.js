/* exported randomTexture, smoothstep, lerp, mix, palette, roundTo */

//returns a random texture that can be used in a shader to generate LUT based noise
var randomTexture = function() {
  var tex = [];
  
  for (var i = 0; i < 256; i++) {
    tex.push([]);
    for (var j = 0; j< 256; j++) {
      tex[i].push({r:0, g:0, b:0});
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
      bmd.pixels[y * bmd.width + x] = Phaser.Color.packPixel(red, green, blue, alpha);
    }
  }

  bmd.context.putImageData(bmd.imageData, 0, 0);
  bmd.dirty = true;
  return bmd;
};

//smoothly interpolates between 0 and 1 using c
//takes in values a, b, c, if c<a returns 0 if c>b returns one
//otherwise smoothly interpolates between 0 and 1
//only limitation is that a < b
var smoothstep = function(a, b, c) {
  var t = Math.max(Math.min((c - a) / (b - a), 1.0), 0.0);
  return t * t * (3.0 - 2.0 * t);
};

//standard linear interpolation
// 0 <= c <= 1
//interpolate between a and b by c
var lerp = function(a, b, c) {
  return (1 - c) * a + c * b;
};

//for interpolating between two colors
//pass in two color objects with open properties 'r', 'g', and 'b'
//interpolate by value c, where 0 <= c <= 1
var mix = function(a, b, c) {
  return {r: lerp(a.r, b.r, c), g: lerp(a.g, b.g, c), b: lerp(a.b, b.b, c)};
};

//pass in object with offset, frequency, amplitude, base color
//objects must contain all four properties 
// o = offset
// f = frequency
// a = amplitude
// b = base color
var palette = function(t, r, g, b) {
  return {r: r.bc + Math.cos(Math.PI * 2 * (t * r.f + r.o)) * r.a,
          g: g.bc + Math.cos(Math.PI * 2 * (t * g.f + g.o)) * g.a,
          b: b.bc + Math.cos(Math.PI * 2 * (t * b.f + b.o)) * b.a};
};

//rounds value t to the nearest multiple of r
var roundTo = function(t, r) {
  return Math.floor(t / r) * r;
};