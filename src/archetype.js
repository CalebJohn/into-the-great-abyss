/* globals utils */
/* exported Resources*/


//initialize parameters for the archetype resources
//these will denote the values that do not change between planets
//consider this a type of struct or definition
var Archetypes = function() {
  this.metal = new Material({activation:{max:70, min:30}, potential:{max:100, min:50}, hardness:{max:90, min:40}, distribution: 1});
  this.rock = new Material({activation:{max:100, min:50}, potential:{max:80, min:30}, hardness:{max:100, min:70}, distribution: 1});
  this.liquid = new Material({activation:{max:80, min:0}, potential:{max:70, min:40}, hardness:{max:10, min:0}, distribution: 1});//maybe curve towards high number
  this.wood = new Material({activation:{max:30, min:0}, potential:{max:40, min:30}, hardness:{max:50, min:30}, distribution: 1});
  this.plant = new Material({activation:{max:20, min:0}, potential:{max:30, min:20}, hardness:{max:30, min:10}, distribution: 1});
  this.gas = new Material({activation:{max:50, min:0}, potential:{max:50, min:10}, hardness:{max:5, min:0}, distribution: 1});
};


Archetypes.prototype = {
  generate_properties: function() {
    //this would in theory randomize by definitions//likely shouldnt be used at all
  }
};

//this gives a specific planet unique properties based on our Archetypal materials, distribution: 1
//
var Resources = function() {
  archetypes = new Archetypes();
  this.metal = archetypes.metal.generate_instance();
  this.rock = archetypes.rock.generate_instance();
  this.liquid = archetypes.liquid.generate_instance();
  this.wood = archetypes.wood.generate_instance();
  this.plant = archetypes.plant.generate_instance();
  this.gas = archetypes.gas.generate_instance();

};

Resources.prototype = {
  print: function() {
    this.metal.print('metal');
    this.rock.print('rock');
    this.liquid.print('liquid');
    this.wood.print('wood');
    this.plant.print('plant');
    this.gas.print('gas');
  },

  clone: function() {
    var r = new Resources();
    r.metal = this.metal.clone();
    r.rock = this.rock.clone();
    r.liquid = this.liquid.clone();
    r.wood = this.wood.clone();
    r.plant = this.plant.clone();
    r.gas = this.gas.clone();
    return r;
  }
};

//hold max and min values for each archetype
//could hold material specific properties and methods as well
var Material = function(mat) {
  //how long something lasts
  //but also makes more brittle
  //poor suited for certain tasks
  if (mat.hardness == null) {
    this.hardness = {max: 100, min: 0};
  } else {
    this.hardness = mat.hardness;
  }

  //how easy it is to extract energy
  if (mat.activation == null) {
    this.activation = {max: 100, min: 0};
  } else {
    this.activation = mat.activation;
  }
  
  //how much energy can be extracted
  if (mat.potential == null) {
    this.potential = {max: 100, min: 0};
  } else {
    this.potential = mat.potential;
  }
  
  //dictates how the resource is distributed between its max and min range
  //may be unneccesary
  //represents the power to raise distribution to 1 is linear
  //used for assigning properties to each planet
  if (mat.distribution == null) {
    this.distribution = 1;
  } else {
    this.distribution = mat.distribution;
  }

  //property of how common a material is in either a given planet or sector
  if (mat.abundance == null) {
    this.abundance = 1;
  } else {
    this.abundance = mat.abundance;
  }
  
};

Material.prototype = {
  //Outputs an instance of the material within the parameters
  //should be used on a planetary scale
  generate_instance: function() {
    //precompute the distribution for properties so we can base our abundance on the quality of the material
    var hd = Math.pow(Math.random(), this.distribution);
    var ad = Math.pow(Math.random(), this.distribution);
    var pd = Math.pow(Math.random(), this.distribution);

    //interpolate between max and min values based on distribution
    var h = utils.lerp(this.hardness.min, this.hardness.max, hd);
    var a = utils.lerp(this.activation.min, this.activation.max, ad);
    var p = utils.lerp(this.potential.min, this.potential.max, pd);
    //this is based on the assumption that high hardness is a positive
    //and that low activation energy is good
    //and that high potential energy is good
    var ab = 1.0 - ((hd+(1.0 - ad)+pd)/3.0);
    return new Material({hardness:h, activation:a, potential:p, abundance:ab});
  }, 

  print: function(x) {
   console.log(x + ":" +
              "\nhardness: " + this.hardness.toPrecision(3) +
              "\nactivation energy: " + this.activation.toPrecision(3) +
              "\npotential energy: " + this.potential.toPrecision(3) +
              "\nabundance: " + this.abundance.toPrecision(3));
  },

  clone: function() {
    return new Material({hardness:this.hardness, activation:this.activation, potential:this.potential, distribution:this.distribution, abundance:this.abundance});
  }
};
