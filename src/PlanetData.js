/* globals SectorData, smoothstep */

var PlanetData = function () {
  this.sectors = [];
  // Will be set in WorldGenerator
  this.mapData = null;
  this.mapSize = 5;
  this.width = 700;
  this.height = 500;
};

PlanetData.prototype = {
  // TODO : This should be replaced with a proper generarion algorithm
  generateMap: function() {
    this.mapData = game.add.bitmapData(this.width, this.height);
    
    var alpha, red, green, blue;
    for (var x = 0; x < this.mapData.width; x++) {
      for (var y = 0; y < this.mapData.height; y++) {
        var nx = x-this.mapData.width*0.5;
        var ny = y-this.mapData.height*0.5;
        alpha = 255;
        red = 255-255*smoothstep(0.5, 0.6, Math.sqrt(nx*nx+ny*ny)/(this.mapData.height));
        green = red;
        blue = 255-red;
        this.mapData.pixels[y * this.mapData.width + x] = (alpha << 24) | (blue << 16) | (green << 8) | red;
      }
    }
    
    this.mapData.context.putImageData(this.mapData.imageData, 0, 0);
    this.mapData.dirty = true;

    this.Types = [
    "Rocky",
    "Fertile",
    "Humid",
    "Mountainous"];

    for (var x = 0; x < this.mapSize; x++) {
      this.sectors.push([]);
      for (var y = 0; y < this.mapSize; y++) {
        this.sectors[x].push(new SectorData(this.Types[Math.floor(Math.random()*4)]));
      }
    }
  },

  getSector: function(x, y) {
    return this.sectors[x][y];
  }
};
