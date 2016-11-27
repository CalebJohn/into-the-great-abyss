// Based on Calebs ButtonGroup object (by based on I mean copied from)
// should have the same kinda interface
//
var TextGroup = function(ctx, x, y, labels) {
  Phaser.Group.call(this, game);
  this.position.setTo(x, y);

  for (var i = 0; i < labels.length; i++) {
    this.addLabel(ctx, labels[i]);
  }
};

TextGroup.prototype = Object.create(Phaser.Group.prototype);
TextGroup.prototype.constructor = TextGroup;

TextGroup.prototype.addLabel = function(ctx, text) {
    if (!('x' in text) || !('y' in text)) {
      throw "Button Creation Error: Must provide an x and y coordinate";
    }

    // This is not a default value
    // it just allows overriding of the button context
    var context = text.context || ctx;

    // The following are to guarentee certain button behaviors
    var size = text.size || 25;

    var style = text.style || {fontSize: size,
                              fill: 'white'};
    style.resolution = window.devicePixelRatio;

    var txt = game.make.text(text.x, text.y, text.name, style);
    txt.anchor.setTo.apply(txt.anchor, text.anchor);

    this.add(txt);
};

