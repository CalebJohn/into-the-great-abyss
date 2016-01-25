var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload () {

}

function create () {
    game.stage.backgroundColor = "#000000"
    
    var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

    var text = game.add.text(game.world.centerX, game.world.centerY, "Succesful window open", style);

    text.anchor.set(0.5);
}

function update() {

}

function render () {

}
