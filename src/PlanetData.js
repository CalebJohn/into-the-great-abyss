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

  //add a bunch of variables here that will define our planets
    //when we generate higher level planet data we will use that to replace all the math.random() calls
  this.randEffect = 0; //warping plus log
    //maybe do one level of warp that warps before the fbm is called
      //but that still triples the calls to simplex
      //so maybe just use cos noise or something like that
      //maybe do some interesting warping based on amplitude frequency stuff
    //play around with swapping amp+freq, or doing other cool things with them
      //like changing based on h
    //call one layer first and put a log on that
      //or call a layer after that has a log
      //maybe combine this with the skew somehow
    //high randeffect could increase skew
  this.variance = 0; //should be computed after water height so it isnt too low
    //do something like a+b*c where a is bottom, b is variance, and c is the noise value
    //additionally can call math.pow when returning h to change the curve

  this.frequency = Math.random()*0.01+0.001; //generate between 0.001 and 0.02 with weight towards a lower frequency
  this.lod = 0.25+0.25*Math.random(); //used in tandom with frequency//may just be a constant


  /*start here when I come back to this*/
  /*// need to compute a nice amount of skew//*/
  this.skew = 1+Math.pow(Math.random(), 1); //stretch in the x direction compared to the y
  this.moisture = Math.random()*0.6;

  console.log("moisture level: " + this.moisture.toPrecision(3)+
              "\nrandom effect: " + this.randEffect.toPrecision(3)+
              "\namplitude variance: " + this.variance.toPrecision(3)+
              "\nfrequency: " + this.frequency.toPrecision(3)+
              "\nskew: " + this.skew.toPrecision(3)+
              "\nlod: " + this.lod.toPrecision(3)
    );
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
    // TODO: use procworlds system of simulation
    //replace fbm with something more complicated
      //using a mixture of worley, logs, exp, with random parameters


    //create a 2d array which holds our height data for the planet
    //This is done so that we can avoid calling our noise function more than once per pixel
    var buffer = [];
    var rivers = [];
    for (var x = 0; x < this.mapData.canvas.width; x++) {
      buffer.push([]);
      rivers.push([]);
      for (var y = 0; y < this.mapData.canvas.height; y++) {
        buffer[x].push(this.heightmap(x, y));
        rivers[x].push(1 - noise.worley2(x*25*this.frequency, y*25*this.frequency));
      }
    }
    

    //Here we will take the height data and convert it to colors
    var alpha, red, green, blue, h, c, i;
    for (var x = 1; x < buffer.length - 1; x++) {
      for (var y = 1; y < buffer[x].length - 1; y++) {
        h = buffer[x][y];
        
        var w = 0;
        if (x>1&&y>1) {
          if (((rivers[x][y]>=rivers[x+1][y]&&rivers[x][y]>=rivers[x-1][y])||(rivers[x][y]>=rivers[x][y+1]&&rivers[x][y]>=rivers[x][y-1]))&&(rivers[x][y]>(0.7 - this.moisture))) {
            w = h;
          }
        }

        var rl = utils.mix(this.landHue, this.waterHue, utils.smoothstep(this.moisture, 1.0, w));
        //This takes the height and maps the land or water color to it
        //the smoothstep means that below 0.3 is water
        //then between 0.3-0.6 there is a smooth gradient
        //and after it is purely land
        c = utils.mix(this.waterHue, rl, utils.smoothstep(this.moisture, this.moisture+0.3, h));
        
        //calculate the normal at a given pixel
        //this allows us to cheaply shadow the terrain
        var d = new Phaser.Point(h - buffer[x + 1][y], h - buffer[x][y + 1]);
        d = d.normalize();
        //map our normal to the range 0-1
        d.x = 0.5 * (d.x + 1);
        //this removes the normal from the water area so we only see it on land
        d.x = utils.lerp(1, d.x, utils.smoothstep(this.moisture+0.1, this.moisture+0.2, h));
        //multiply the shadow shading by individual colors and apply directly to canvas pixel buffer
        red = c.r * d.x;
        green = c.g * d.x;
        blue = c.b * d.x;
        alpha = utils.smoothstep(0.0, 100.0, Math.min(Math.min(x, this.mapData.canvas.width - x), Math.min(y, this.mapData.canvas.height - y))) 
              * (utils.smoothstep(0.0, this.moisture+0.3, h)) * 255;
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
  },

  heightmap: function(x, y) {
    var h = 0;
    var a = 0.5;
    var p = this.frequency;
    var s = 1/6
    for (var i = 0; i < 6; i++) {
      h += (0.5+0.5*noise.simplex2(x * p, y * p)) * a;
      a *= 0.5;
      p = this.frequency+Math.pow(s*i, 2)*(this.lod-this.frequency);
    }
    return h;
  }

};
