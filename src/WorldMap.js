/* globals ButtonGroup, planetData, noise, utils */
var WorldMap = function (x, y, containerLevel) {
  Phaser.Group.call(this, game);
  this.sectorBtns = null;
  this.container = containerLevel;

  // These are the default grid size and button sizes
  this.size = planetData.mapSize;
  this.btnWidth = (planetData.width-planetData.border*2+5) / this.size;
  this.btnHeight = (planetData.height-planetData.border*2+5) / this.size;

  this.visibleAlpha = 0.4;
  this.hiddenAlpha = 0.9;
  this.peakAlpha = 0.8;

  this.bkrd = null;

  this.position.setTo(planetData.border, planetData.border);
  this.create();
};

WorldMap.prototype = Object.create(Phaser.Group.prototype);
WorldMap.prototype.constructor = WorldMap;

WorldMap.prototype.selected = function(btn) {
  if (btn.faded === true) {
    //only update colors if not done before
    if (btn.active === false) {

      this.setAlpha(btn);
      btn.active = true;

      var bi = this.sectorBtns.getChildIndex(btn);
      //get position in terms of array units
      var bposx = Math.floor(bi/this.size);
      var bposy = bi%this.size;
      // Check all buttons in the map, and lighten neighbours
      for (var i = 0; i < this.sectorBtns.length; i++) {
        var oBtn = this.sectorBtns.getChildAt(i);
        var oposx = Math.floor(i/this.size);
        var oposy = i%this.size;
        var dx = oposx-bposx;
        var dy = oposy-bposy;

        if (Math.abs(dx) <= 1 &&
            Math.abs(dy) <= 1 &&
            oBtn.active === false) {
          //unfortunately these both need to update every time
          //otherwise they dont blend properly
          this.blendAlpha(oBtn, dx, dy);
          this.cloudAlpha(oBtn);
          oBtn.faded = true;
        }
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
                 upAlpha: 0,
                 overAlpha: 0,
                 downAlpha: this.visibleAlpha, //leaving this in to show which sector was clicked//TODO: make nicer / add feedback on hover
                 active: false,
                 faded: false});
    }
  }

  var startBtn = btns[Math.floor(Math.random() * btns.length)];
  startBtn.faded = true;

  this.bkrd = game.add.sprite(-this.position.x, -this.position.y);
  this.bkrd.texture = PIXI.Texture.fromCanvas(planetData.mapData.canvas);

  this.setAlpha(startBtn, 128);
  this.cloudAlpha(startBtn);

  this.sectorBtns = new ButtonGroup(this, 0, 0, btns);
  this.add(this.bkrd);
  this.add(this.sectorBtns);
};

//rename this to something more appropriate
WorldMap.prototype.setAlpha = function(button, alpha) {
  var k;
  var x = button.x + this.position.x;
  var y = button.y + this.position.y;
  var w = this.btnWidth;
  var h = this.btnHeight;
  var alpha = alpha || 255;
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      k = 4 * ((j + y) * planetData.mapData.canvas.width + (i + x));
      if (x + i < planetData.mapData.canvas.width && y + j < planetData.mapData.canvas.height) {
        planetData.mapData.data[k + 3] = alpha; 
      }
    }
  }

  planetData.mapData.ctx.putImageData(planetData.mapData.imageData, 0, 0);
  this.bkrd.texture.baseTexture.dirty();
};

WorldMap.prototype.blendAlpha = function(button, dx, dy) {
  var k, a;
  var x = button.x + this.position.x;
  var y = button.y + this.position.y;
  var w = this.btnWidth;
  var h = this.btnHeight;
  var fade = 1.0;
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      k = 4 * ((j + y) * planetData.mapData.canvas.width + (i + x));
      if (x + i < planetData.mapData.canvas.width && y + j < planetData.mapData.canvas.height) {

        //so the fade is calculated correctly
        fade = 1.0;
        if (dx < 0) {
          fade *= (i / w);
        } else if (dx > 0) {
          fade *= (1 - i / w);
        }
        if (dy < 0) {
          fade *= (j / h);
        } else if (dy > 0) {
          fade *= (1 - j / h);
        }
        fade = fade * fade * fade * (fade * (6 * fade - 15) + 10); //perlins quintic interpolation
        a = planetData.mapData.data[k + 3];
        planetData.mapData.data[k + 3] = utils.lerp(0, 254, Math.max(fade, a / 254));
      }
    }
  }

  planetData.mapData.ctx.putImageData(planetData.mapData.imageData, 0, 0);
  this.bkrd.texture.baseTexture.dirty();
};

WorldMap.prototype.cloudAlpha = function(button) {
  var k, a;
  var x = button.x + this.position.x;
  var y = button.y + this.position.y;
  var w = this.btnWidth;
  var h = this.btnHeight;
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      k = 4 * ((j + y) * planetData.mapData.canvas.width + (i + x));
      if (x + i < planetData.mapData.canvas.width && y + j < planetData.mapData.canvas.height) {
        a = planetData.mapData.data[k + 3];
        var c = Math.max(0, a - utils.lerp(0, Math.min(a, 255 - a), utils.smoothstep(0.4, 0.7, 1 - noise.fbm2((x + i) * 0.01, (y + j) * 0.01, 4))));
        planetData.mapData.data[k+3] = c;
      }
    }
  }

  planetData.mapData.ctx.putImageData(planetData.mapData.imageData, 0, 0);
  this.bkrd.texture.baseTexture.dirty();
};