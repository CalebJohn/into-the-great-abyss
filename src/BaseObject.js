
/* for now this will be very simple
 * should store resources
 * should have resource numbers
 * number of gatherers
 * possibly gathering rate (but this could be a combo of number and resouce abundance)
 */
var BaseObject = function(resources) {
  //reference to the resource composition of the sector
  //can be used to lower resource abundance in sector data
  //but currently just used to read abundance of each material
  this.resources = resources;

  //for now list all the possible resources
  //must correspond with those defined in archetype.js
  //later we may want a more robust approach
  this.metalCount = 0;
  this.rockCount = 0;
  this.liquidCount = 0;
  this.woodCount = 0;
  this.plantCount = 0;
  this.gasCount = 0;

  //gatherers represent arbitrary units which gather resources
  //we can make them automiton or people for gameplay sake
  this.metalGatherers = 1;
  this.rockGatherers = 1;
  this.liquidGatherers = 1;
  this.woodGatherers = 1;
  this.plantGatherers = 1;
  this.gasGatherers = 1;

  //used to offset the rate of resource gathering
  //but at some point this should be tied into time rather than arbitrary units
  this.globalRate = 0.01;
};

BaseObject.prototype = {
  update: function() {
    this.metalCount += this.globalRate * this.metalGatherers * this.resources.metal.abundance;
    this.rockCount += this.globalRate * this.rockGatherers * this.resources.rock.abundance;
    this.liquidCount += this.globalRate * this.liquidGatherers * this.resources.liquid.abundance;
    this.woodCount += this.globalRate * this.woodGatherers * this.resources.wood.abundance;
    this.plantCount += this.globalRate * this.plantGatherers * this.resources.plant.abundance;
    this.gasCount += this.globalRate * this.gasGatherers * this.resources.gas.abundance;
  },

  getResources: function() {
    //returns a formatted string with all the resources and curent values
    //currently only shows an integer version of resources but can even
    return 'Resources:' +
           '\nMetal: ' + Math.floor(this.metalCount) + 
           '\nRock: ' + Math.floor(this.rockCount) +
           '\nLiquid: ' + Math.floor(this.liquidCount) +
           '\nWood: ' + Math.floor(this.woodCount) +
           '\nPlant: ' + Math.floor(this.plantCount) +
           '\nGas: ' + Math.floor(this.gasCount);
  },

  getGatherers: function() {
    //returns a formatted string of how many workers there are in each resource
    return 'Workers:' +
           '\nMetal: ' + Math.floor(this.metalGatherers) + 
           '\nRock: ' + Math.floor(this.rockGatherers) +
           '\nLiquid: ' + Math.floor(this.liquidGatherers) +
           '\nWood: ' + Math.floor(this.woodGatherers) +
           '\nPlant: ' + Math.floor(this.plantGatherers) +
           '\nGas: ' + Math.floor(this.gasGatherers);

  }, 

  getAbundance: function() {
    //return a formatted string with the abundance of each resource in this sector
    return 'Abundance:' +
           '\nMetal: ' + Math.floor(this.resources.metal.abundance) + 
           '\nRock: ' + Math.floor(this.resources.rock.abundance) +
           '\nLiquid: ' + Math.floor(this.resources.liquid.abundance) +
           '\nWood: ' + Math.floor(this.resources.wood.abundance) +
           '\nPlant: ' + Math.floor(this.resources.plant.abundance) +
           '\nGas: ' + Math.floor(this.resources.gas.abundance);

  }

};
