Phaser.Filter.sunset = function (game) {

    Phaser.Filter.call(this, game);

    this.fragmentSrc = [
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

    		"float dTime = 0.0;",
    		"void main( void )",
    		"{",
    		    
    		    "//adjust uv",
    			"vec2 uv = gl_FragCoord.xy;",
    		    "uv.x/=resolution.x;",
    		    "uv.y/=resolution.y;",
    		    "uv.x*=(resolution.x/resolution.y);",
    		    
    		    "//Time of day (dTime) calculation",
    		    "dTime=time;",
    		    "float sh = mouse.y;//0.5+0.5*sin(dTime);",
    		    "//sun position",
    		    "vec2 sun = vec2(0.5*(resolution.x/resolution.y), -0.21+1.42*sh);// 0.5+0.72*sin(dTime));",
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

};

Phaser.Filter.sunset.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.sunset.prototype.constructor = Phaser.Filter.sunset;

Phaser.Filter.sunset.prototype.init = function (width, height) {
    this.setResolution(width, height);
};
