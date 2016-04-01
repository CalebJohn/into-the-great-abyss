Phaser.Filter.sceneFilter = function (game) {

    Phaser.Filter.call(this, game);
    //this.uniform.development = 0;


    //warnings are shown, something like, no texture or something
    //what is happening is the shader is being initilizaed with the default variables with
    // a value of null, but there is no error because they are either initialized later or
    //not used
    this.uniforms.iChannel0 = { type: 'sampler2D', value: null, textureData: { repeat: true } };
    this.uniforms.loc = {type: '2f', value: null};
    this.uniforms.fog = {type: '1f', value: 0.0};
    this.uniforms.warp = {type: '1f', value: 1.0};
    this.uniforms.roughness = {type: '1f', value: 1.0};
    this.uniforms.TimeOfDay = {type: '1f', value: 0.0};
    this.uniforms.baseHue = {type: '3f', value: {x:0.5, y:0.7, z:0.4}};
    //try to add in as many uniforms as possible, then our decisions on making terrain can be adjusted from a much higher level standpoint
    this.fragmentSrc = game.cache.getShader('sceneShader');
   

};

Phaser.Filter.sceneFilter.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.sceneFilter.prototype.constructor = Phaser.Filter.sceneFilter;

Phaser.Filter.sceneFilter.prototype.init = function (width, height, texture, x, y) {
    
    this.setResolution(width, height);
    texture.baseTexture._powerOf2 = true;
    this.uniforms.iChannel0.value = texture;
    texture.baseTexture._powerOf2 = true;
    this.uniforms.loc.value = {x:x, y:y};
};

Phaser.Filter.sceneFilter.prototype.update = function(x, t) {
    this.uniforms.loc.value.x = x.x.toFixed(2);
    this.uniforms.loc.value.y = x.y.toFixed(2);
    this.uniforms.time.value = this.game.time.totalElapsedSeconds();
    this.uniforms.TimeOfDay.value = t;
};
