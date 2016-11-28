var BaseObject = function(resources) {
  //whether or not a base is active
  //needs to be like this so we can use a getter and setter
  this._active = false;
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

  //this is an object that should hold all the info that the base is going to display
  //should have a type 'label' which doesnt get updated
  //and allows us to display information about the base
  this.information = [{name: 'Resources',
                       type: 'resource', // type may be unecessary
                       x: 20 + game.world.width,
                       y: 100,
                       anchor: [0.0, 0.0],
                       context: this,
                       updater: this.getResources},
                       {name: 'Gatherers',
                       type: 'gatherers', 
                       x: 170 + game.world.width,
                       y: 100,
                       anchor: [0.0, 0.0],
                       context: this,
                       updater: this.getGatherers},
                       {name: 'abundance',
                       type: 'abundance', 
                       x: 300 + game.world.width,
                       y: 100,
                       anchor: [0.0, 0.0],
                       context: this,
                       updater: this.getAbundance}];

  //and this is the object that actually displays our text
  //it might not be a bad idea to move all this stuff into the sectordata object
  //but for the time being it makes more sense here
  this.infoDisplay = null; // new TextGroup(this, 0, 0, this.information);

};

BaseObject.prototype = {
  //updates our resource count every frame
  // TODO decouple this from frame
  //    accept a delta time in the function 
  //      in order to do this we need to first keep track of time globally
  update: function() {
    this.metalCount += this.globalRate * this.metalGatherers * this.resources.metal.abundance;
    this.rockCount += this.globalRate * this.rockGatherers * this.resources.rock.abundance;
    this.liquidCount += this.globalRate * this.liquidGatherers * this.resources.liquid.abundance;
    this.woodCount += this.globalRate * this.woodGatherers * this.resources.wood.abundance;
    this.plantCount += this.globalRate * this.plantGatherers * this.resources.plant.abundance;
    this.gasCount += this.globalRate * this.gasGatherers * this.resources.gas.abundance;
  },

  //use getters and setters so that the textgroup is initialized when the base is created
  //not when the sector is initialized
  get active() {
    return this._active;
  },

  set active(x) {
    this._active = x;
    this.infoDisplay = new TextGroup(this, 0, 0, this.information);
  },

  updateText: function() {
    //update the information here
    //use the information to selectively update a textGroup
    if (this.information.length != this.infoDisplay.children.length) {
      this.infoDisplay.destroy();
      this.infoDisplay = new TextGroup(this, 0, 0, this.information);
    }

    for(var i = 0; i < this.information.length;i++) {
      this.infoDisplay.getChildAt(i).setText(this.information[i].updater(this.information[i].context));
    }
  },

  getResources: function(ctx) {
    //returns a formatted string with all the resources and curent values
    //currently only shows an integer version of resources but can be changed easily
    //the use of context here may seem a tad hacky but it is the only way for the information to
    //be both easily updated and manually retreived
    var context = ctx || this;
    return 'Resources:' +
           '\nMetal: ' + Math.floor(context.metalCount) + 
           '\nRock: ' + Math.floor(context.rockCount) +
           '\nLiquid: ' + Math.floor(context.liquidCount) +
           '\nWood: ' + Math.floor(context.woodCount) +
           '\nPlant: ' + Math.floor(context.plantCount) +
           '\nGas: ' + Math.floor(context.gasCount);
  },

  getGatherers: function(ctx) {
    //returns a formatted string of how many workers there are in each resource
    var context = ctx || this;
    return 'Workers:' +
           '\nMetal: ' + Math.floor(context.metalGatherers) + 
           '\nRock: ' + Math.floor(context.rockGatherers) +
           '\nLiquid: ' + Math.floor(context.liquidGatherers) +
           '\nWood: ' + Math.floor(context.woodGatherers) +
           '\nPlant: ' + Math.floor(context.plantGatherers) +
           '\nGas: ' + Math.floor(context.gasGatherers);

  }, 

  getAbundance: function(ctx) {
    //return a formatted string with the abundance of each resource in this sector
    var context = ctx || this;
    return 'Abundance:' +
           '\nMetal: ' + context.resources.metal.abundance.toPrecision(3) + 
           '\nRock: ' + context.resources.rock.abundance.toPrecision(3) +
           '\nLiquid: ' + context.resources.liquid.abundance.toPrecision(3) +
           '\nWood: ' + context.resources.wood.abundance.toPrecision(3) +
           '\nPlant: ' + context.resources.plant.abundance.toPrecision(3) +
           '\nGas: ' + context.resources.gas.abundance.toPrecision(3);

  }

};
