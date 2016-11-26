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
                   callback: this.collectResources},
                  {name: 'Resources:' + //this shouldnt be a button, its just a temporary measure for now
                         '\nMetal: ' + resources.metal.abundance.toPrecision(3) + 
                         '\nRock: ' + resources.rock.abundance.toPrecision(3) +
                         '\nLiquid: ' + resources.liquid.abundance.toPrecision(3) +
                         '\nWood: ' + resources.wood.abundance.toPrecision(3) +
                         '\nPlant: ' + resources.plant.abundance.toPrecision(3) +
                         '\nGas: ' + resources.gas.abundance.toPrecision(3),
                  x: 20 + game.world.width,
                  y: 100, 
                  anchor: [0.0, 0.0],
                  context: this,
                  callback: null}];

  this.resources = resources;
              
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
