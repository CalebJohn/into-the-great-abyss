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
    var name = btn.name || '';
    var x = btn.x || 0;
    var y = btn.y || 0;
    var size = btn.size || 25;
    var anchor = btn.anchor || [0.5, 0.5];
    var imgSize = btn.imgSize || [1, 1];
    var context = btn.context || ctx;

    var downAlpha = btn.downAlpha;
    var upAlpha = btn.upAlpha;
    var overAlpha = btn.overAlpha;
    if (downAlpha == null) {downAlpha = 0.8;}
    if (upAlpha == null) {upAlpha = 1;}
    if (overAlpha == null) {overAlpha = 0.5;}

    var style = btn.style || {fontSize: size,
                              fill: 'white'};
    style.resolution = window.devicePixelRatio;

    var txt = game.make.text(0, 0, name, style);
    txt.anchor.setTo.apply(txt.anchor, anchor);

    var sprite = game.make.sprite(0, 0, btn.image,
        btn.overFrame, btn.outFrame, btn.downFrame, btn.upFrame);
    sprite.anchor.setTo.apply(sprite.anchor, anchor);
    sprite.scale.setTo.apply(sprite.scale, imgSize);

    var button = game.make.button(x, y, null, btn.callback, context);
  	button.anchor.setTo.apply(button.anchor, anchor);
    button.text = name;
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

    // txt is referenced using a closure
    button.setText = function(text) {txt.setText(text); this.text = text;};

    this.add(button);
};

