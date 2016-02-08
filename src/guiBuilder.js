/* globals window */

// TODO : Re-evaluate the api of the gui-builder
var GUIBuilder = function(buttons) {
  this.buttons = [];
  this.group = window.game.add.group();

  for (var i = 0; i < buttons.length; i++) {
    var btn = buttons[i];
    this.buttons[i] = this.makeButton(btn.x, btn.y, btn.name, btn.size, btn.anchor, btn.callback);
    this.group.add(this.buttons[i]);
  }
};

GUIBuilder.prototype = {
  // makeButton is used in the constructor of GUIBuilder, but can
  // also be used on it's own
  makeButton: function(x, y, name, size, anchor, callback) {
    if (!size) { size = 25; }
    if (!anchor) { anchor = [0.5, 0.5]; }

    var button = window.game.add.text(x, y, name, {resolution: window.devicePixelRatio});
  	button.anchor.setTo.apply(button.anchor, anchor);
  	button.fontSize = size;
  	button.fill = 'white';

  	button.inputEnabled = true;
  	button.events.onInputOver.add(function(target) {target.alpha = 100;});
    if (callback) { button.events.onInputDown.add(callback); }
  	button.events.onInputDown.add(function(target) {target.alpha = 200;});
    button.events.onInputOut.add(function(target) {target.alpha = 1;});

    return button;
  }
};
