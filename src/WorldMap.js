/* globals ButtonGroup, planetData */
var WorldMap = function (x, y, containerLevel) {
  Phaser.Group.call(this, game);
  this.sectorBtns = null;
  this.container = containerLevel;

  // These are the default grid size and button sizes
  this.size = planetData.mapSize;
  this.btnWidth = planetData.width / this.size;
  this.btnHeight = planetData.height / this.size;

  this.visibleAlpha = 0.4;
  this.hiddenAlpha = 0.9;
  this.peakAlpha = 0.8;

  this.position.setTo(x - this.size * this.btnWidth / 2, y - this.size * this.btnHeight / 2); // Can't set an anchor
  this.create();
};

WorldMap.prototype = Object.create(Phaser.Group.prototype);
WorldMap.prototype.constructor = WorldMap;

WorldMap.prototype.selected = function(btn) {
  if (btn.upAlpha === this.visibleAlpha || btn.upAlpha === 0) {
    // Make button transparent so the map can be seen
    btn.upAlpha = 0;
    btn.overAlpha = 0;
    btn.downAlpha = this.visibleAlpha;

    // Check all buttons in the map, and lighten neighbours
    for (var i = 0; i < this.sectorBtns.length; i++) {
      var oBtn = this.sectorBtns.getChildAt(i);

      if (Math.abs(oBtn.x - btn.x) <= this.btnWidth &&
          Math.abs(oBtn.y - btn.y) <= this.btnHeight &&
          oBtn.upAlpha > 0) {
        oBtn.upAlpha = this.visibleAlpha;
        oBtn.overAlpha = this.visibleAlpha;
        oBtn.alpha = oBtn.upAlpha;
      }
    }
    var indices = this.sectorIndex(btn);
    this.container.updateButtons(planetData.getSector(indices[0], indices[1]));
    this.container.toggleView();
  }
};

// Used to find the indices of the sector that was pressed
WorldMap.prototype.sectorIndex = function(btn) {
  var x = btn.x / this.btnWidth;
  var y = btn.y / this.btnHeight;
  return [x, y];
};

WorldMap.prototype.create = function() {
  var btns = [];
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      btns.push({image: null,
                 x: x * this.btnWidth,
                 y: y * this.btnHeight,
                 imgSize: [this.btnWidth, this.btnHeight],
                 callback: this.selected,
                 upAlpha: this.hiddenAlpha,
                 overAlpha: this.hiddenAlpha,
                 downAlpha: this.peakAlpha});
    }
  }
  var startBtn = btns[Math.floor(Math.random() * btns.length)];
  startBtn.upAlpha = this.visibleAlpha;
  startBtn.overAlpha = this.visibleAlpha;

  var bkrd = new Phaser.Sprite(game, -this.position.x, -this.position.y);
  bkrd.texture = PIXI.Texture.fromCanvas(planetData.mapData.canvas);

  this.sectorBtns = new ButtonGroup(this, 0, 0, btns);
  this.add(bkrd);
  this.add(this.sectorBtns);
};
