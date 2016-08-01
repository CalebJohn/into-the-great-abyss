/* globals SectorData, utils, noise */

var PlanetData = function () {
  this.sectors = [];
  // Will be set in WorldGenerator
  this.mapData = {canvas: null, ctx: null, imageData: null, data: null};
  this.mapSize = 5;
  this.width = game.width;
  this.height = game.height;
  this.border = 100;
  this.landHue = null;
  this.waterHue = null;

  //when we generate higher level planet data we will use that to replace all the math.random() calls
  this.randEffect = Math.pow(Math.random(), 2); //warping plus log
  this.frequency = Math.pow(Math.random() * 0.1, 2) + 0.001;
  this.rFrequency = Math.pow(Math.random() * 0.1, 2) + 0.001;//generate between 0.001 and 0.01 with weight towards a lower frequency//river frequency
  this.erodibility = Math.random(); //I may not keep this. It just makes the water erode the river valleys a little less to help alleviate the frequency of archipelagos
  this.skew = 0.4 + Math.random() * 0.6;
  this.aVariance = Math.random() * 0.9 + 0.1; //effects the variance in altitude 
  this.aFrequency = Math.random() * 0.005 + 0.0005; //frequency of amplitude damping
  this.aSkew = Math.random() > 0.5? Math.random() : 1.0 + Math.random() * 3.0; //skew towards lower or higher values
  this.altitude = 0.0;
  this.moisture = Math.random() * 0.8 * this.aVariance;
  this.lod = 0.03 + 0.05 * Math.random() + (1 - this.moisture) * 0.05; //adjusted by moisture to help fake erosion

  console.log("moisture level: " + this.moisture.toPrecision(3) +
              "\nrandom effect: " + this.randEffect.toPrecision(3) +
              "\nfrequency: " + this.frequency.toPrecision(3) +
              "\nriver spacing: " + this.rFrequency.toPrecision(3) +
              "\nerodibility: " + this.erodibility.toPrecision(3) +
              "\nskew: " + this.skew.toPrecision(3) +
              "\nlod: " + this.lod.toPrecision(3) +
              "\naltitudeVariance: " + this.aVariance.toPrecision(3)
    );
  };

PlanetData.prototype = {
  generateMap: function() {
    //TODO: Make the color picking smarter and more aesthetic
    //this creates our base color for the land and water
    //once we generate material data we can use those to influence the color choice
    this.landHue = utils.palette(Math.random(), {bc: 150, f: 1, o: 0, a: 100}, {bc: 90, f: 2, o: 0, a: 90}, {bc: 75, f: 0.8, o: 0, a: 75});
    this.waterHue = utils.palette(Math.random(), {bc: 75, f: 0.5, o: 0, a: 75}, {bc: 128, f: 2, o: 0, a: 128}, {bc: 200, f: 1, o: 0, a: 55});

    //this entire block is used to create a canvas element and initiate all 
    //its variables that we will need to access
    this.mapData.canvas = document.createElement("canvas");
    this.mapData.canvas.width = this.width;
    this.mapData.canvas.height = this.height;
    this.mapData.ctx = this.mapData.canvas.getContext('2d');
    this.mapData.imageData = this.mapData.ctx.getImageData(0, 0, this.mapData.canvas.width, this.mapData.canvas.height);
    this.mapData.data = this.mapData.imageData.data;

    //create a 2d array which holds our height data for the planet
    //This is done so that we can avoid calling our noise function more than once per pixel
    var buffer = [];
    var rivers = [];
    var peak = 0;
    var low = 1;
    var terrainHeight = 0;
    var river = 0;
    for (var x = 0; x < this.mapData.canvas.width; x++) {
      buffer.push([]);
      rivers.push([]);
      for (var y = 0; y < this.mapData.canvas.height; y++) {
        this.altitude = Math.pow((noise.simplex2(x * this.aFrequency, y * this.aFrequency) * 0.5 + 0.5), this.aSkew) * this.aVariance;
        terrainHeight = this.heightmap(x * this.skew, y) * this.altitude;
        river = 1 - noise.worley2(x * 25 * this.rFrequency + terrainHeight * 3, y * 25 * this.rFrequency + terrainHeight * 3);//curve the river based on height
        rivers[x].push(river);
        terrainHeight = terrainHeight - river * 0.8 * this.erodibility * (this.altitude - terrainHeight) * this.moisture;
        buffer[x].push(terrainHeight);//decrease height around rivers

        if (terrainHeight > peak) {
          peak = terrainHeight;
        } else if (terrainHeight < low) {
          low = terrainHeight;
        }
        
      }
    }

    //TODO: add texture to water
    //Here we will take the height data and convert it to colors
    var alpha, red, green, blue, h, c, i, riverColor, d;
    var waterShade1, waterShade2, waterShadeLerp;
    var waterLevel = utils.lerp(low, peak, utils.smoothstep(low, peak, this.moisture) * 0.3);
    //point at which water is not shaded at all
    waterShade1 = waterLevel + 0.1 * this.moisture * (peak - low);
    //upper bound for water
    waterShade2 = waterLevel + 0.2 * this.moisture * (peak - low);

    for (var x = 1; x < buffer.length - 1; x++) {
      for (var y = 1; y < buffer[x].length - 1; y++) {
        h = buffer[x][y];
        river = rivers[x][y];
        var w = 0;

        //this block determines where the rivers are
        /*TODO: use an analytic derivitive to compute w rather than a logic block*/
        if (x > 1 && y > 1) {
          if (((river >= rivers[x + 1][y] && river >= rivers[x - 1][y]) || 
               (river >= rivers[x][y + 1] && river >= rivers[x][y - 1])) && 
               (river > (0.7 - this.moisture))) {
            w = peak - h;
          }
        }
        //determines what the color of the river will be so that they can fade in towards sea level
        riverColor = utils.mix(this.landHue, this.waterHue, utils.smoothstep(0, peak - waterLevel, w));
        //This takes the height and maps the land or water color to it
        //the smoothstep means that below 0.3 is water
        //then between 0.3-0.6 there is a smooth gradient
        //and after it is purely land
        c = utils.mix(this.waterHue, riverColor, utils.smoothstep(waterLevel, waterLevel + 0.2 * this.moisture * (peak - low), h));
        
        //calculate the normal at a given pixel
        //this allows us to cheaply shadow the terrain
        d = {x: h - buffer[x + 1][y], y: 0.002, z: h - buffer[x][y + 1]};
        var dlen = Math.sqrt(d.x * d.x + d.y * d.y + d.z * d.z);
        d = {x: d.x / dlen, y: d.y / dlen, z: d.z / dlen};
        //map our normal to the range 0-1
        d.x = 0.5 * (d.x + 1);
        //this removes the normal from the water area so we only see it on land
        
        //interpolation factor so water isnt treated like land with shading
        //the subtraction makes sure the rivers receive no shading
        waterShadeLerp = h - w * 0.5 * this.moisture;
        d.x = utils.lerp(1, d.x, utils.smoothstep(waterShade1, waterShade2, waterShadeLerp));
        //multiply the shadow shading by individual colors and apply directly to canvas pixel buffer
        red = c.r * d.x;
        green = c.g * d.x;
        blue = c.b * d.x;
        alpha = utils.smoothstep(0.0, this.border, Math.min(Math.min(x, this.mapData.canvas.width - x), 
                                                   Math.min(y, this.mapData.canvas.height - y))) * 255;
        i = 4 * (y * this.mapData.canvas.width + x);

        this.mapData.data[i] = red;
        this.mapData.data[i + 1] = green;
        this.mapData.data[i + 2] = blue;
        if (alpha>=255){
          this.mapData.data[i + 3] = 0;
        } else {
          this.mapData.data[i + 3] = alpha;
        }
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

  //this function is used to return a height at a given point
  //not completely accurate because river valleys are computed after the fact
  heightmap: function(x, y) {
    //this block initializes variables needed for the loop
    var lh = 0; //local height//height of individual octave
    var p = this.frequency;
    var s = 1 / 6; //scaling factor for LOD
    var px = x, py = y;
    var a = (0.75 + 0.15 * noise.simplex2(px * p, py * p)) * this.altitude; //Use noise to initilize amplitude in order to create more variation
    var h = 0.0; //initial total height value
    var r = [1.212, 0.656 - this.randEffect * 0.3, -0.856 + this.randEffect * 0.3, 1.537]; //rotation matrix for adding interesting effects to frequency calculation

    //this loop will compute the height value from different octaves of noise
    for (var i = 0; i < 5; i++) {
      //rotate the scaling of the frequency to break up monotony
      px = (px * r[0] + py * r[1]);
      py = (px * r[2] + py * r[3]);

      //scale frequency based on LOD
      p = this.frequency + Math.pow(s * (i + 1), 2) * (this.lod - this.frequency);

      //rotate between worley noise (voronoi) and regular simplex
      if ((i === 2)||(i === 4)) {
        lh = (0.5 - noise.worley2(px * p + i * h * this.randEffect, py * p + i * h * this.randEffect)) * a;//has a warping factor added which becomes stronger at smaller octaves
      } else {
        lh = (0.5 + 0.5 * noise.simplex2(px * p + h * 4 * this.randEffect, py * p + lh * 4 * this.randEffect)) * a;//also has warping factor where y value uses local height to help break up the appearence
      }
      //add height to total height
      h += lh;

      //this last term is more complicated, normally as you increase octaves you decrease the impact each subsequent octave
      //has on the total value. But in our case we are faking hydrolic erosion by lowering the impact of noise at lower heights
      //this has the effect of smoothing out the overall heightmap at lower heights
      //we then adjust this effect based on the overall moisture level
      //this way planets lacking moisture do not look as eroded as those with lots of moisture
      a *= (0.4 * (1 - this.moisture) + h * 0.5 * this.moisture); 
      a *= utils.lerp(0.5, 1.0, this.altitude);
    }
    return Math.abs(h); // negative values mess up coloring 
  }

};
