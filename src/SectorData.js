/* globals BaseObject */
var SectorData = function (type, resources) {
  this.type = type;
  this.visible = false;

  // TODO : This might need to be more dynamic for when we add more types
  this.exploreTypes = {
    "Rocky": "Spelunk",
    "Fertile": "Bushwhack",
    "Humid": "Dive",
    "Mountainous": "Climb"};

  this.resources = resources;
  //initialize a base object for every sector
  //the current implementation limits us to one base per sector
  //but I think that makes more sense for now
  //essentially we have a base per sector that we can activate
  this.base = new BaseObject(resources, this.exploreTypes[type]); 
};

SectorData.prototype = {
  getType: function() {
    return this.type;
  },

  setMapVisible: function(vsb) {
    this.visible = vsb;
  },

  printBaseInfo: function() {
    console.log(this.base);
  }
};
