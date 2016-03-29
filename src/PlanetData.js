/* globals SectorData */

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
    var grd = this.mapData.context.createLinearGradient(0, 0, this.width, this.height);
    grd.addColorStop(0, "rgb(200, 50, 50)");
    grd.addColorStop(0.3, "rgb(200, 0, 75)");
    grd.addColorStop(1, "rgb(200, 0, 150)");
    this.mapData.context.fillStyle = grd;
    this.mapData.context.fillRect(0, 0, this.width, this.height); 

    for (var x = 0; x < this.mapSize; x++) {
      this.sectors.push([]);
      for (var y = 0; y < this.mapSize; y++) {
        this.sectors[x].push(new SectorData('Rocky'));
      }
    }
  },

  getSector: function(x, y) {
    return this.sectors[x][y];
  }
};
