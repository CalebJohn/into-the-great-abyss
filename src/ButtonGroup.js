var ButtonGroup = function(ctx, x, y, buttons) {
  Phaser.Group.call(this, game);
  this.position.setTo(x, y);

  for (var i = 0; i < buttons.length; i++) {
    this.makeButton(ctx, buttons[i]);
  }
};

ButtonGroup.prototype = Object.create(Phaser.Group.prototype);
ButtonGroup.prototype.constructor = ButtonGroup;

ButtonGroup.prototype.makeButton = function(ctx, btn) {
    if (!('x' in btn) || !('y' in btn)) {
      throw "Button Creation Error: Must provide an x and y coordinate";
    }

    // This is not a default value
    // it just allows overriding of the button context
    var context = btn.context || ctx;

    // The following are to guarentee certain button behaviors
    var size = btn.size || 25;
    var imgSize = btn.imgSize || [1, 1];
    var downAlpha = btn.downAlpha;
    var upAlpha = btn.upAlpha;
    var overAlpha = btn.overAlpha;
    var active = btn.active;
    var faded = btn.faded;
    if (downAlpha == null) {downAlpha = 0.8;}
    if (upAlpha == null) {upAlpha = 1;}
    if (overAlpha == null) {overAlpha = 0.5;}
    if (active == null) {active = false;}
    if (faded == null) {faded = false;}

    var style = btn.style || {fontSize: size,
                              fill: 'white'};
    style.resolution = window.devicePixelRatio;

    var txt = game.make.text(0, 0, btn.name, style);
    txt.anchor.setTo.apply(txt.anchor, btn.anchor);

    var sprite = game.make.sprite(0, 0, btn.image,
        btn.overFrame, btn.outFrame, btn.downFrame, btn.upFrame);
    sprite.anchor.setTo.apply(sprite.anchor, btn.anchor);
    sprite.scale.setTo.apply(sprite.scale, imgSize);

    var button = game.make.button(btn.x, btn.y, null, btn.callback, context);
  	button.anchor.setTo.apply(button.anchor, btn.anchor);
    button.text = btn.name;
    button.alpha = upAlpha;
    button.upAlpha = upAlpha;
    button.downAlpha = downAlpha;
    button.overAlpha = overAlpha;
    button.addChild(txt);
    button.addChild(sprite);

    button.events.onInputDown.add(function(target) {target.alpha = target.downAlpha;});
    button.events.onInputUp.add(function(target) {target.alpha = target.upAlpha;});
    button.events.onInputOver.add(function(target) {target.alpha = target.overAlpha;});
    button.events.onInputOut.add(function(target) {target.alpha = target.upAlpha;});

    button.active = active;
    button.faded = faded;
    // txt is referenced using a closure
    button.setText = function(text) {txt.setText(text); this.text = text;};

    this.add(button);
};

ButtonGroup.prototype.toggleFreeze = function(exception) {
    var children = this.children;
    for (var i = 0; i < children.length; i++) {
      if ((children[i].text != exception.name)) {
        children[i].inputEnabled = children[i].inputEnabled == false;
      }
    }
};