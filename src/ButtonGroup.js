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
    var x = btn.x || 0;
    var y = btn.y || 0;
    var size = btn.size || 25;
    var anchor = btn.anchor || [0.5, 0.5];
    var downAlpha = btn.downAlpha || 200;
    var upAlpha = btn.upAlpha || 1;
    var overAlpha = btn.overAlpha || 100;
    var outAlpha = btn.outAlpha || 1;
    var style = btn.style || {fontSize: size,
                              fill: 'white'};
    style.resolution = window.devicePixelRatio;

    var txt = game.make.text(0, 0, btn.name, style);
    txt.anchor.setTo.apply(txt.anchor, anchor);

    var button = game.make.button(x, y, btn.image, btn.callback, ctx,
        btn.overFrame, btn.outFrame, btn.downFrame, btn.upFrame);
  	button.anchor.setTo.apply(button.anchor, anchor);
    button.text = btn.name;
    button.addChild(txt);

    button.events.onInputDown.add(function(target) {target.alpha = downAlpha;});
    button.events.onInputUp.add(function(target) {target.alpha = upAlpha;});
    button.events.onInputOver.add(function(target) {target.alpha = overAlpha;});
    button.events.onInputOut.add(function(target) {target.alpha = outAlpha;});

    // txt is referenced using a closure
    button.setText = function(text) {txt.setText(text); this.text = text;};

    this.add(button);
};
