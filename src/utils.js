/* exported utils */

var utils = {
  //returns a random texture that can be used in a shader to generate LUT based noise
  randomTexture : function() {
    var tex = [];
    
    for (var i = 0; i < 256; i++) {
      tex.push([]);
      for (var j = 0; j < 256; j++) {
        tex[i].push({r:0, g:0, b:0});
      }
    }

    var canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    var data = imageData.data;

    var alpha = 0;
    var red = 0;
    var green = 0;
    var blue = 0;
    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
      tex[x][y].r = Math.random()*255;
      tex[x][y].b = Math.random()*255;
        }
      }

    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.width; y++) {
        var x2 = (x-37) & 255;
        var y2 = (y-17) & 255;
        tex[x][y].g = tex[x2][y2].r;
        }
      }

    var i;
    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        alpha = 255;
        red = tex[x][y].r;
        green = tex[x][y].g;
        blue = tex[x][y].b;
        i = 4 * (y * canvas.width + x);
        data[i] = red;
        data[i + 1] = green;
        data[i + 2] = blue;
        data[i + 3] = alpha;
        }
      }

    ctx.putImageData(imageData, 0, 0);
    game.cache.addCanvas('randomTex', canvas, ctx);
  },

  //smoothly interpolates between 0 and 1 using c
  //takes in values a, b, c, if c<a returns 0 if c>b returns one
  //otherwise smoothly interpolates between 0 and 1
  //only limitation is that a < b
  smoothstep : function(a, b, c) {
    var t = Math.max(Math.min((c - a) / (b - a), 1.0), 0.0);
    return t * t * (3.0 - 2.0 * t);
  },

  //using math equations to define a crater
  //c is distance from epicenter
  //a is size of the lip
  //b is the falloff curve of the basin
  //a low number for b makes the sides flat (linear slope)
  //a high number for b makes the basin have a flat bottom and steep sides
  crater : function(a, b, c) {
    var t = Math.max(Math.min(c, 1.0), 0.0);
    var l = 1.0/t;
    t *= a;
    t = Math.pow(t, b);
    t = Math.min(t, l);
    var i = this.smoothstep(0.0, a-1.0, 1.0-c);
    return this.lerp(1, t, i)
  },

  //standard linear interpolation
  // 0 <= c <= 1
  //interpolate between a and b by c
  lerp : function(a, b, c) {
    return (1 - c) * a + c * b;
  },

  //for interpolating between two colors
  //pass in two color objects with open properties 'r', 'g', and 'b'
  //interpolate by value c, where 0 <= c <= 1
  mix : function(a, b, c) {
    return {r: this.lerp(a.r, b.r, c), g: this.lerp(a.g, b.g, c), b: this.lerp(a.b, b.b, c)};
  },

  //pass in object with offset, frequency, amplitude, base color
  //objects must contain all four properties 
  // o = offset
  // f = frequency
  // a = amplitude
  // b = base color
  palette : function(t, r, g, b) {
    return {r: r.bc + Math.cos(Math.PI * 2 * (t * r.f + r.o)) * r.a,
            g: g.bc + Math.cos(Math.PI * 2 * (t * g.f + g.o)) * g.a,
            b: b.bc + Math.cos(Math.PI * 2 * (t * b.f + b.o)) * b.a};
  },

  //rounds value t to the nearest multiple of r
  roundTo : function(t, r) {
    return Math.floor(t / r) * r;
  },

  transitions : {
    fade : function(game, time, from, to, fun) {
      var filter = game.add.bitmapData(game.width, game.height);
      filter.context.fillStyle = "#000000";
      filter.context.fillRect(0, 0, game.width, game.height); 
      var sprite = game.add.sprite(0, 0, filter);
      sprite.alpha = from;
      return game.add.tween(sprite).to({alpha: to},
                                       time,
                                       fun,
                                       true);
    },

    fadeOut : function(game, time) {
      return this.fade(game, time, 0, 1, Phaser.Easing.Quartic.Out);
    },

    fadeIn : function(game, time) {
      return this.fade(game, time, 1, 0, Phaser.Easing.Quartic.In);
    }
  }
};
