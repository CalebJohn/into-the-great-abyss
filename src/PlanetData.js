/* globals SectorData, utils, noise */

var PlanetData = function () {
  this.sectors = [];
  // Will be set in WorldGenerator
  this.mapData = {canvas: null, ctx: null, imageData: null, data: null};
  this.mapSize = 5;
  this.width = 700;
  this.height = 500;
  this.landHue = null;
  this.waterHue = null;
  };

PlanetData.prototype = {
  generateMap: function() {
    // TODO: clean up formatting issues, add warp functions
    //this creates our base color for the land and water
    //once we generate material data we can use those to influence the color choice
    this.landHue = utils.palette(Math.random(), {bc: 150, f: 1, o: 0, a: 100}, {bc: 90, f: 2, o: 0, a: 90}, {bc: 75, f: 0.8, o: 0, a: 75});
    this.waterHue = utils.palette(Math.random(), {bc: 75, f: 0.5, o: 0, a: 75}, {bc: 128, f: 2, o: 0, a: 128}, {bc: 200, f: 1, o: 0, a: 55});

    //this entire block is used to create a canvas element and initiate all 
    //its variables that we will need to access
    this.mapData.canvas = document.createElement("canvas");
    this.mapData.canvas.width = game.width;
    this.mapData.canvas.height = game.height;
    this.mapData.ctx = this.mapData.canvas.getContext('2d');
    this.mapData.imageData = this.mapData.ctx.getImageData(0,0,this.mapData.canvas.width, this.mapData.canvas.height);
    this.mapData.data = this.mapData.imageData.data;

    // TODO: add hydro erosion to this
    // TODO: add complex features, cliffs, rivers, etc.
    //create a 2d array which holds our height data for the planet
    //This is done so that we can avoid calling our noise function more than once per pixel
    var buffer = [];
    var rivers = [];
    var drops = []
    for (var x = 0; x < this.mapData.canvas.width; x++) {
      buffer.push([]);
      rivers.push([]);
      for (var y = 0; y < this.mapData.canvas.height; y++) {
        buffer[x].push(noise.fbm2(x*0.004, y*0.004));
        //rivers[x].push(1 - noise.worley2(x*0.1, y*0.1));
        rivers[x].push(0);
      }
    }
    for (var i = 0; i < 1000; i++) {
      drops.push({x: Math.floor(10+Math.random()*(this.mapData.canvas.width-20)), y: Math.floor(10+Math.random()*(this.mapData.canvas.height-20)), s: Math.random()});
    }
    for (var i = 0; i < 100; i++) {
      if (drops.length <=1) {break;}

      for (var e = 0; e < drops.length; e++) {
        if (drops[e]!=null) {
        var dir = {x:0, y:0};
        var drop = drops[e];
        var mx = 0;
        var h = buffer[drop.x][drop.y];
        for (var x = -1;x<=1;x++) {
          for (var y = -1;y<=1;y++) {

            if ( buffer[drop.x+x][drop.y+y]-h> mx) {
              mx =  buffer[drop.x+x][drop.y+y]-h;
              dir = {x:x, y:y};
            }
          }
        }
        //rivers[drop.x][drop.y] = 1;
        ar(drop.x, drop.y, drop.s, rivers);
        drops[e].x = drop.x = drop.x+ dir.x;
        drops[e].y = drop.y = drop.y+ dir.y;
        drops[e].s *= 1.05;
        if (drop.x<10 || drop.y<10 ||drop.x >this.mapData.width-10||drop.y>this.mapData.height-10||h>0.65) {
          drops.splice(e, 1);
          e--;
        }
      }
      }
    }



    //Here we will take the height data and convert it to colors
    var alpha, red, green, blue, h, c, i;
    for (var x = 0; x < buffer.length - 1; x++) {
      for (var y = 0; y < buffer[x].length - 1; y++) {
        h = buffer[x][y];
        //This takes the height and maps the land or water color to it
        //the smoothstep means that below 0.4 is solid land
        //then between 0.4-0.7 there is a smooth gradient
        //and after it is purely water
        /*var w = 0;
        if (x>1&&y>1) {
          if (((rivers[x][y]>=rivers[x+1][y]&&rivers[x][y]>=rivers[x-1][y])||(rivers[x][y]>=rivers[x][y+1]&&rivers[x][y]>=rivers[x][y-1]))&&(rivers[x][y]>0.3)) {
            w = 1-h;
          }
        }*/
        var w = rivers[x][y];
        var rl = utils.mix(this.landHue, this.waterHue, utils.smoothstep(0.5, 0.6, w));
        c = utils.mix(rl, this.waterHue, utils.smoothstep(0.4, 0.7, h));
        
        //calculate the normal at a given pixel
        //this allows us to cheaply shadow the terrain
        var d = new Phaser.Point(h - buffer[x + 1][y], h - buffer[x][y + 1]);
        d = d.normalize();
        //map our normal to the range 0-1
        d.x = 0.5 * (d.x + 1);
        //this removes the normal from the water area so we only see it on land
        d.x = utils.lerp(d.x, 1, utils.smoothstep(0.5, 0.6, h));
        //multiply the shadow shading by individual colors and apply directly to canvas pixel buffer
        red = c.r * d.x;
        green = c.g * d.x;
        blue = c.b * d.x;
        alpha = utils.smoothstep(0.0, 100.0, Math.min(Math.min(x, this.mapData.canvas.width - x), Math.min(y, this.mapData.canvas.height - y))) 
              * utils.smoothstep(0.0, 0.6, 1 - h) * 255;
        i = 4 * (y * this.mapData.canvas.width + x);
        this.mapData.data[i] = red;
        this.mapData.data[i + 1] = green;
        this.mapData.data[i + 2] = blue;
        this.mapData.data[i + 3] = alpha;
      }
    }

    //Applies the pixel buffer back into the canvas
    this.mapData.ctx.putImageData(this.mapData.imageData, 0, 0);

    var type;
    for (var x = 0; x < this.mapSize; x++) {
      this.sectors.push([]);
      for (var y = 0; y < this.mapSize; y++) {
        //pick a spot in the middle of the sector and determine height
        //right now the sectors dont line up exactly with the underlying heightmap, but I think that will be fine
        //especially once we fix this up a bit
        h = buffer[(x + 0.5) * (this.mapData.canvas.width / this.mapSize)][(y + 0.5) * (this.mapData.canvas.height / this.mapSize)];
        //based on height pick a land type
        //This will need to be tweaked and improved once we are generating more data
        if (h > 0.7) {
          type = 'Humid';
        } else if (h > 0.5) {
          type = 'Fertile';
        } else if (h > 0.4) {
          type = 'Rocky';
        } else {
          type = 'Mountainous';
        }
        this.sectors[x].push(new SectorData(type));
      }
    }
  },

  getSector: function(x, y) {
    return this.sectors[x][y];
  }
};


//this function is temporary it should not be around for the PR
var ar = function(x, y, s, riv) {
  var as = Math.min(2, Math.floor(s));
  s += riv[x][y];
  for (var i = -1*as;i<=1*as;i++) {
    for (var j = -1*as;j<=1*as;j++) {
      riv[x+i][y+j] += Math.min(1, Math.max(0, s-Math.min(Math.abs(i), Math.abs(j))));
      riv[x+i][y+j] = Math.min(1, Math.max(0, riv[x+i][y+j]));
    }
  }
};