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

    button.events.onInputDown.add(function(target) {target.alpha = 200;});
    button.events.onInputUp.add(function(target) {target.alpha = 1;});
    button.events.onInputOver.add(function(target) {target.alpha = 100;});
    button.events.onInputOut.add(function(target) {target.alpha = 1;});

    // txt is referenced using a closure
    button.setText = function(text) {txt.setText(text); this.text = text;};

    this.add(button);
};
