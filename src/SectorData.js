var SectorData = function (type) {
  this.type = type;
  this.visible = false;

  // TODO : This might need to be more dynamic for when we add more types
  this.exploreTypes = {
    "Rocky": "Spelunk",
    "Fertile": "Bushwhack",
    "Humid": "Dive",
    "Mountainous": "Climb"};

  this.buttons = [{name: this.exploreTypes[this.type],
                   x: game.world.centerX + game.world.width,
                   y: game.world.centerY,
                   anchor: [0.5, 0.5],
                   context: this,
                   callback: this.collectResources}];
              
};

SectorData.prototype = {
  getType: function() {
    return this.type;
  },

  setMapVisible: function(vsb) {
    this.visible = vsb;
  },

  collectResources: function(btn) {
    console.log(btn.text);
  }
};
