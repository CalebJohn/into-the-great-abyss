var SectorData = function (type, resources) {
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

  //this should be used for miscelleneaus labels which do not need to be updated in real time
  this.labels = [{name: 'No Base in this sector',
                  x: 20 + game.world.width,
                  y: 100, 
                  anchor: [0.0, 0.0],
                  context: this}];

  this.resources = resources;
  this.base = null;            
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
  },

  printBaseInfo: function(btn) {
    console.log(this.base)
  }
};
