var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload () {

}

function create () {
    game.stage.backgroundColor = "#000000"
    
    var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

    var text = game.add.text(game.world.centerX, game.world.centerY, "Succesful window open", style);
    text.anchor.set(0.5);
    var bmd = game.add.bitmapData(128,128);

    bmd.ctx.beginPath();

    for(var i=0;i<128;i++) {
  
      for (var j=0;j<128;j++) {
 
           bmd.setPixel(i, j, i*2, j*2, 255-(i+j));

      }

    }

    bmd.ctx.fill();

    var sprite = game.add.image(game.world.centerX, game.world.centerY, bmd);
}

function update() {

}

function render () {

}
