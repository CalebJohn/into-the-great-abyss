var Menu = function () {};

Menu.prototype = {
  preload: function() {
  	var backDropFilter;
  	var backDrop;

    var titleText;
  	var startButton;
  	var optionButton;
  	var fullscreenButton;
  	var muteButton;
  	var seedButton;
  	var returnButton;
    //In later changes I may want to create a list of buttons rather than store each individually
    //It may be nice to have something more dynamic
  },

  create: function() {
  	game.stage.backgroundColor = '#FFFFFF';
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
  	//load Filter
  	this.initMenuBackground();
  	//Apply filter to image in background
  	backDrop = game.add.image();
  	backDrop.width = game.width;
  	backDrop.height = game.height;
  	backDrop.filters = [backDropFilter];
    
    //draw title text
    titleText = game.add.text((game.width * 0.5 - 64) * 0.5, (game.height * 0.5 - 70) * 0.61, 'POTENTIAL FORTNIGHT');
    titleText.anchor.setTo(0.5, 0.5);
    titleText.fontSize = 30;
    titleText.fill = 'white';
    titleText.alpha = 100;
  	// make menu buttons
    this.drawMain();
  },

  update: function() {
  	backDropFilter.update(game.input.activePointer);
  },

  render: function() {
  	
  },

  drawMain: function() {
    //make buttons and initialize their functions
  	startButton = this.makeButton(game.world.centerX, game.world.centerY - 20, 'START');
  	startButton.events.onInputDown.add(function() {game.state.start('Cutscene');});
  	optionButton = this.makeButton(game.world.centerX, game.world.centerY + 20, 'OPTIONS');
  	optionButton.events.onInputDown.add(this.toggleMenu, this);
  	fullscreenButton = this.makeButton(game.world.centerX, game.world.centerY - 60, 'FULLSCREEN');
  	fullscreenButton.visible = false;
    fullscreenButton.events.onInputDown.add(this.fullscreenToggle, this);
  	muteButton = this.makeButton(game.world.centerX, game.world.centerY - 20, 'SOUND: ' + (game.sound.mute ? 'OFF':'ON'));
  	muteButton.visible = false;
  	muteButton.events.onInputDown.add(function(target) {game.sound.mute = game.sound.mute === false; target.setText('SOUND: '+ (game.sound.mute ? 'OFF':'ON'));})
  	seedButton = this.makeButton(game.world.centerX, game.world.centerY + 20, 'SEED: ');
  	seedButton.visible = false;
  	returnButton = this.makeButton(game.world.centerX, game.world.centerY + 60, 'RETURN');
  	returnButton.visible = false;
  	returnButton.events.onInputDown.add(this.toggleMenu, this);
  },

  //generic button creator, initializes buttons with standard formatting
  makeButton: function(x, y, name) {
  	var button = game.add.text(x, y, name);
  	button.anchor.setTo(0.5, 0.5);
  	button.fontSize = 25;
  	button.fill = 'white';
  	button.inputEnabled = true;
  	button.events.onInputOver.add(function(target) {target.alpha = 150;});
    button.events.onInputOut.add(function(target) {target.alpha = 1;});
    return button;
  },

  //functonality for the fullscreen button
  fullscreenToggle: function() {
    if (game.scale.isFullScreen)
    {
        this.resizeGame(1000, 600);
        
        game.scale.stopFullScreen();
    }
    else
    {
        
       this.resizeGame(window.screen.width, window.screen.height);
        game.scale.startFullScreen();
        
        
    }
  },

  //toggles between regular menu and options menu
  toggleMenu: function() {
  	startButton.visible = startButton.visible === false;
  	optionButton.visible = optionButton.visible === false;
  	fullscreenButton.visible = fullscreenButton.visible === false;
  	muteButton.visible = muteButton.visible === false;
  	seedButton.visible = seedButton.visible === false;
  	returnButton.visible = returnButton.visible === false;
  },

  // called in order to resize the game window, used with fullscreen
  resizeGame: function(w, h) {
    game.scale.setGameSize(w, h);
    backDropFilter.setResolution(game.width, game.height);
    backDrop.width = game.width;
    backDrop.height = game.height;
    titleText.position.setTo((game.width * 0.5 - 64) * 0.5, (game.height * 0.5 - 70) * 0.61);
    startButton.position.setTo(game.world.centerX, game.world.centerY - 20);
    optionButton.position.setTo(game.world.centerX, game.world.centerY + 20);
    fullscreenButton.position.setTo(game.world.centerX, game.world.centerY - 60);
    muteButton.position.setTo(game.world.centerX, game.world.centerY - 20);
    seedButton.position.setTo(game.world.centerX, game.world.centerY + 20);
    returnButton.position.setTo(game.world.centerX, game.world.centerY + 60);
  },

  //Load up shader and apply to backDrop sprite
  initMenuBackground: function() {
    var fragmentSrc = [
        "precision highp float;",

        "uniform float     time;",
        "uniform vec2      resolution;",
        "uniform vec2      mouse;",
        
    		"vec2 hash2(vec2 p ) {",
    		   "return fract(sin(vec2(dot(p, vec2(123.4, 748.6)), dot(p, vec2(547.3, 659.3))))*5232.85324);",
    		"}",
    		"float hash(vec2 p) {",
    		  "return fract(sin(dot(p*11.5, vec2(43.232, 75.876)))*45246.32957); ",  
    		"}",

    		"//Based off of iq's described here: http://www.iquilezles.org/www/articles/voronoilin",
    		"float voronoi(vec2 p, float s) {",
    		    "vec2 n = floor(p);",
    		    "vec2 f = fract(p);",
    		    "float md = 5.0;",
    		    "vec2 m = vec2(0.0);",
    		    "for (int i = -1;i<=1;i++) {",
    		        "for (int j = -1;j<=1;j++) {",
    		            "vec2 g = vec2(i, j);",
    		            "vec2 o = hash2(n+g)*s;",
    		            "o = 0.5+0.5*sin(0.64+5.038*o);",
    		            "vec2 r = g + o - f;",
    		            "float d = dot(r, r);",
    		            "if (d<md) {",
    		              "md = d;",
    		              "m = n+g+o;",
    		           " }",
    		        "}",
    		    "}",
    		    "return md;",
    		"}",

    		"float ov(vec2 p) {",
    		    "float v = 0.0;",
    		    "float a = 0.4;",
    		    "for (int i = 0;i<6;i++) {",
    		        "v+= voronoi(p, 1.0)*a;",
    		        "p*=2.0;",
    		        "a*=0.5;",
    		    "}",
    		    "return v;",
    		"}",

    		"float TOD = 0.0;",
    		"void main( void )",
    		"{",
    		    
    		    "//adjust uv",
    			"vec2 uv = gl_FragCoord.xy;",
    		    "uv.x/=resolution.x;",
    		    "uv.y/=resolution.y;",
    		    "uv.x*=(resolution.x/resolution.y);",
    		    
    		    "//TOD calculation",
    		    "TOD=time;",
    		    "float sh = mouse.y;//0.5+0.5*sin(TOD);",
    		    "//sun position",
    		    "vec2 sun = vec2(0.5*(resolution.x/resolution.y), -0.21+1.42*sh);// 0.5+0.72*sin(TOD));",
    		    "//calculate sky gradient",
    		    "   //stars",
    		    "vec3 nightsky = mix(vec3(0.2, 0.2, 0.6), vec3(1.0, 1.0, 0.8), (0.8*smoothstep(0.9992, 1.0, 1.0-voronoi(uv*10.0, 16.0))*(1.0-sh)*(1.0-sh)));",
    		    "nightsky = mix(nightsky, vec3(1.0, 1.0, 0.8), (0.2+0.8*smoothstep(0.996, 1.0, 1.0-voronoi(uv*35.0, 16.0))*(1.0-sh)*(1.0-sh)));",
    		    "nightsky = mix(nightsky, vec3(1.0, 1.0, 0.8), (0.8*smoothstep(0.99, 1.0, hash(uv))*(1.0-sh)*(1.0-sh)));",
    		    "vec3 zenith = mix(nightsky, vec3(0.4, 0.6, 1.0), sh);",
    		   " vec3 azimuth = mix(vec3(1.0, 0.4, 0.4), vec3(0.75, 0.9, 1.0), sh);",
    		    "vec3 skygrad = mix(azimuth, zenith, smoothstep(0.0, 0.7+0.2*(cos((1.0-sh)*3.14159*3.0)), uv.y));",
    		    
    		    "//add the sun",
    		    "vec3 col = mix(vec3(1.0, 0.2+0.8*sh, 0.0), skygrad, smoothstep(0.2, 0.203, length(sun-uv)));",
    		    
    		    "// make some thin wispy clouds",
    		    
    		    
    		    "// terrain",
    		    "float h = ov(vec2(uv.x, 1.0));",
    		    "col = mix(col, vec3(0.3+0.65*sh, 0.3+0.2*sh, 0.2+0.1*sh), smoothstep(0.028, 0.03, h-uv.y));",
    		    
    		    
    			"gl_FragColor = vec4(col, 1.0);",
    		"}"
    	];
    backDropFilter = new Phaser.Filter(game, null, fragmentSrc);
    backDropFilter.setResolution(game.width, game.height);
  },
    
};