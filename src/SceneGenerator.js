var SceneGenerator = function(filterName, width, height) {
	this.texture = game.cache.getBitmapData('randomTex').texture;
    this.inView = window.game.add.image();
    this.inView.width = width;
    this.inView.height = height;
    this.scene  = window.game.add.filter(filterName, width, height, this.texture, Math.random()*1000, Math.random()*1000);
    this.inView.filters = [this.scene];

};

SceneGenerator.prototype = {
	update: function() {
		//this.scene.update()
	}
};

