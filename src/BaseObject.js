
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
  }

};
