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

  this.bkrd = null;

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
    /*nothing changes when update alpha is called form here*/
    //maybe it is a scoping issue?
    this.updateAlpha(300, 300, 100, 100);

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
      btns.push({image: 'fadeButton',
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

  this.bkrd = new Phaser.Sprite(game, -this.position.x, -this.position.y);
  this.bkrd.texture = PIXI.Texture.fromCanvas(planetData.mapData.canvas);

  /*works when update alpha is called form here but not from the other place*/
  this.updateAlpha(200, 200, 50, 100);

  this.sectorBtns = new ButtonGroup(this, 0, 0, btns);
  this.add(this.bkrd);
  this.add(this.sectorBtns);
};


/*test function*/

WorldMap.prototype.updateAlpha = function(x, y, w, h) {
  var k;
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      k = 4 * ((j+y) * planetData.mapData.canvas.width + (i+x));
      if (planetData.mapData.data[k + 3] == 0) {
        if (x+i<planetData.mapData.canvas.width&&y+j<planetData.mapData.canvas.height) {
          planetData.mapData.data[k+3] = 255; 
        }
      }
    }
  }

  planetData.mapData.ctx.putImageData(planetData.mapData.imageData, 0, 0);
  /*console.log(x);
  this.remove(this.bkrd);
  this.bkrd = new Phaser.Sprite(game, -this.position.x, -this.position.y);
  this.bkrd.texture = PIXI.Texture.fromCanvas(planetData.mapData.canvas);
  this.add(this.bkrd);*/
  //this.set(this.bkrd, '.texture', PIXI.Texture.fromCanvas(planetData.mapData.canvas));
  
  //this.bkrd.texture = PIXI.Texture.fromCanvas(planetData.mapData.canvas);
  //this.bkrd.setTexture(PIXI.Texture.fromCanvas(planetData.mapData.canvas));
  //this.bkrd.texture.valid = false;
  //this.add(this.bkrd);
};