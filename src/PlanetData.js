/* globals SectorData, smoothstep, lerp, noise, mix, palette */

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
    this.landHue = palette(Math.random(), {bc: 150, f: 1, o: 0, a: 100}, {bc: 90, f: 2, o: 0, a: 90}, {bc: 75, f: 0.8, o: 0, a: 75});
    this.waterHue = palette(Math.random(), {bc: 75, f: 0.5, o: 0, a: 75}, {bc: 128, f: 2, o: 0, a: 128}, {bc: 200, f: 1, o: 0, a: 55});

    //this entire block is used to create a canvas element and initiate all 
    //its variables that we will need to access
    this.mapData.canvas = document.createElement("canvas");
    this.mapData.canvas.width = this.width;
    this.mapData.canvas.height = this.height;
    this.mapData.ctx = this.mapData.canvas.getContext('2d');
    this.mapData.imageData = this.mapData.ctx.getImageData(0,0,this.mapData.canvas.width, this.mapData.canvas.height);
    this.mapData.data = this.mapData.imageData.data;

    // TODO: add hydro erosion to this
    // TODO: add complex features, cliffs, rivers, etc.
    //create a 2d array which holds our height data for the planet
    //This is done so that we can avoid calling our noise function more than once per pixel
    var buffer = [];
    for (var x = 0; x < this.width; x++) {
      buffer.push([]);
      for (var y = 0; y < this.height; y++) {
        buffer[x].push(noise.fbm2(x * 0.005, y * 0.005));
      }
    }

    //Here we will take the height data and convert it to colors
    var alpha, red, green, blue, h, c, i;
    for (var x = 0; x < this.width - 1; x++) {
      for (var y = 0; y < this.height - 1; y++) {
        h = buffer[x][y];
        alpha = 255;
        //This takes the height and maps the land or water color to it
        //the smoothstep means that below 0.4 is solid land
        //then between 0.4-0.7 there is a smooth gradient
        //and after it is purely water
        c = mix(this.landHue, this.waterHue, smoothstep(0.4, 0.7, h));
        //calculate the normal at a given pixel
        //this allows us to cheaply shadow the terrain
        var d = new Phaser.Point(h - buffer[x + 1][y], h - buffer[x][y + 1]);
        d = d.normalize();
        //map our normal to the range 0-1
        d.x = 0.5 * (d.x + 1);
        //this removes the normal from the water area so we only see it on land
        d.x = lerp(d.x, 1, smoothstep(0.5, 0.6, h));
        //multiply the shadow shading by individual colors and apply directly to canvas pixel buffer
        red = c.r * d.x;
        green = c.g * d.x;
        blue = c.b * d.x;
        i = 4 * (y * this.width + x);
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
        h = buffer[(x + 0.5) * (this.width / this.mapSize)][(y + 0.5) * (this.height / this.mapSize)];
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
