/* globals ButtonGroup */
var WorldMap = function (x, y, size, width, height) {
  Phaser.Group.call(this, game);
  this.sectorBtns = null;

  // These are the default grid size and button sizes
  this.size = size || 5;
  this.btnWidth = width / this.size || 140;
  this.btnHeight = height / this.size || 100;

  this.position.setTo(x - this.size * this.btnWidth / 2, y - this.size * this.btnHeight / 2); // Can't set an anchor
  this.create();
};

WorldMap.prototype = Object.create(Phaser.Group.prototype);
WorldMap.prototype.constructor = WorldMap;

WorldMap.prototype.selected = function(btn) {
  // Make button transparent so the map can be seen
  btn.upAlpha = 0;
  btn.overAlpha = 0;

  // Check all buttons in the map, and lighten neighbours
  for (var i = 0; i < this.sectorBtns.length; i++) {
    var oBtn = this.sectorBtns.getChildAt(i);

    if (Math.abs(oBtn.x - btn.x) <= this.btnWidth &&
        Math.abs(oBtn.y - btn.y) <= this.btnHeight &&
        oBtn.upAlpha > 0) {
      oBtn.upAlpha = 0.4;
      oBtn.overAlpha = 0.4;
      oBtn.alpha = oBtn.upAlpha;
    }
  }
};

WorldMap.prototype.create = function() {
  var btns = [];
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      btns.push({image: 'fadeButton',
                 x: x * this.btnWidth,
                 y: y * this.btnHeight,
                 anchor: [0, 0],
                 imgSize: [this.btnWidth, this.btnHeight],
                 callback: this.selected,
                 upAlpha: 0.9,
                 overAlpha: 0.9,
                 downAlpha: 0.4});
    }
  }

  // Only temporary, Data should be pulled from PlanetData
  var backgroundBmd = game.add.bitmapData(this.size * this.btnWidth, this.size * this.btnHeight);
  var grd = backgroundBmd.context.createLinearGradient(0, 0, this.size * this.btnWidth, this.size * this.btnHeight);
  grd.addColorStop(0, "rgb(200, 50, 50)");
  grd.addColorStop(0.3, "rgb(200, 0, 75)");
  grd.addColorStop(1, "rgb(200, 0, 150)");
  backgroundBmd.context.fillStyle = grd;
  backgroundBmd.context.fillRect(0, 0, this.size * this.btnWidth, this.size * this.btnHeight); 
  var bkrd = new Phaser.Sprite(game, 0, 0, backgroundBmd);

  this.sectorBtns = new ButtonGroup(this, 0, 0, btns);
  this.add(bkrd);
  this.add(this.sectorBtns);
};

