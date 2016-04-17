precision highp float;

uniform float     time;
uniform vec2      resolution;
uniform vec2      mouse;

uniform sampler2D iChannel0;
uniform vec2      loc;
uniform float     TimeOfDay;
uniform vec3      baseHue;

uniform float     fog;
uniform float     warp;
uniform float     roughness;
uniform float     water;

const mat3 m = mat3( -0.70,  0.80,  0.60,
                    -0.80,  0.36, -0.48,
                    -0.60, -0.48,  0.64 );

vec2 hash2(vec2 p ) {
  return fract(sin(vec2(dot(p, vec2(123.4, 748.6)), dot(p, vec2(547.3, 659.3))))*5232.85324);
}
float hash(vec2 p) {
  return fract(sin(dot(p*11.5, vec2(43.232, 75.876)))*45246.32957); 
}

float noise( vec3 x ) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f*f*f*(f*(f*6.0-15.0)+10.0);

  vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
  vec2 rg = texture2D( iChannel0, (uv+0.5)/256.0, -100.0 ).yx;
  
  //high quality noise
  /*vec2 uv = (p.xy+vec2(37.0,17.0)*p.z);
  vec2 rg1 = texture2D( iChannel0, (uv+ vec2(0.5,0.5))/256.0, -100.0 ).yx;
  vec2 rg2 = texture2D( iChannel0, (uv+ vec2(1.5,0.5))/256.0, -100.0 ).yx;
  vec2 rg3 = texture2D( iChannel0, (uv+ vec2(0.5,1.5))/256.0, -100.0 ).yx;
  vec2 rg4 = texture2D( iChannel0, (uv+ vec2(1.5,1.5))/256.0, -100.0 ).yx;
  vec2 rg = mix( mix(rg1,rg2,f.x), mix(rg3,rg4,f.x), f.y );*/
  return mix( rg.x, rg.y, f.z );
}

float noise( in vec2 x )
{
  vec2 p = floor(x);
  vec2 f = fract(x);
  vec2 uv = p.xy + f.xy*f.xy*(3.0-2.0*f.xy);
  return texture2D( iChannel0, (uv+118.4)/256.0, -100.0 ).x;
}

//Based off of iq's described here: http://www.iquilezles.org/www/articles/voronoilin",
float voronoi(vec2 p, float s) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  float md = 5.0;
  vec2 m = vec2(0.0);
  for (int i = -1;i<=1;i++) {
    for (int j = -1;j<=1;j++) {
      vec2 g = vec2(i, j);
      vec2 o = hash2(n+g)*s;
      o = 0.5+0.5*sin(0.64+5.038*o);
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d<md) {
        md = d;
        m = n+g+o;
      }
    }
  }
  return md;
}

/*for noise:
 add in warping,
 play aorund with warping
 change the path of effects over levels of octave
 */ 
float ov(vec2 p) {
  float v = 0.0;
  float a = 0.4;
  for (int i = 0;i<5;i++) {
    v+= voronoi(p, 1.0)*a;
    p*=2.0;
    a*=0.5;
  }
  return v;
}

float fbml(vec3 p) {
  float h = 0.0;//ov(p.xz*0.2)*0.5;
  float a = 0.6;
  p*=0.5;
  for (int i=0;i<2;i++) {
    h+= noise(p)*a;
    a= -a*0.4;
    p*= m*2.2;
  }
  return h;
}

float fbm(vec3 p) {
  float h = 0.0;//ov(p.xz*0.2)*0.5;
  float a = 0.6;
  p*=0.5*vec3(0.9, 1.0, 0.6);
  for (int i=0;i<6;i++) {
    h+= noise(p)*a;
    a= -a*0.4;
    p*= m*2.2;
  }
  return h;
}

//pinch off noise around top
float map (vec3 pos) {
  float y = pos.y;
  pos+= vec3(noise((pos+vec3(45.7, 2.4, 7.7))*0.15), noise((pos+vec3(25.1, 36.7, 61.8))*0.01), noise((pos+vec3(15.4, 12.3, 17.9))*0.04))*4.0;
  //float h = pos.y 
  float h = y*0.3 + fbm(pos)//noise
  //+0.3*smoothstep(0.7, 1.0, pos.y)//knock off loose chunks
  ;//-clamp((0.4-pos.y)*3.0, 0.0, 1.0)*3.0;//hard floor
  return h;
}

vec3 calcNormal(in vec3 pos, float t) {
  vec3 e = vec3(max(0.02, 0.001*t), 0.0, 0.0);
  return normalize(vec3(
                    map(pos+e.xyy)-map(pos-e.xyy),
                    map(pos+e.yxy)-map(pos-e.yxy),
                    map(pos+e.yyx)-map(pos-e.yyx)));
}

//copied from IQ
float intersect( in vec3 ro, in vec3 rd)
{
    float t = 0.1;
    float tmax = 25.0;
  for( int i=0; i<160; i++ )
  {
        vec3 pos = ro + t*rd;
        float res = map( pos );
        if( res<(0.001*t) || t>tmax  ) break;
        t += res;
  }

  return t;
}

vec3 material(vec3 p, vec3 n, float t) {
  float normDir = .5 * dot(n, vec3(0., 1., 0.));

  //colors should be passed in as a uniform
  vec3 col = vec3(0.6)*noise(p*vec3(10.0, 150.0, 10.0));
  col = mix(col, baseHue, smoothstep(0.3, 0.4, normDir ));

  //sunlight
  vec3 I = normalize(vec3(cos(TimeOfDay)*200.0, sin(TimeOfDay)*100.0, 100.0));
  float s = clamp(smoothstep(0.0, 0.5, dot(I, n)), 0.0, 1.0);

  return mix(col * vec3(0.4+0.6*s), vec3(0.7, 0.7, 1.0), smoothstep(0.0, 1.0, t/(25.0*fog)));
}


void main( void) {
  vec2 xy = -1.0 + 2.0*gl_FragCoord.xy/resolution.xy;
  vec2 sp = xy*vec2(resolution.x/resolution.y,1.0);
  vec3 ro = vec3(loc.x, 0.5+0.0*fbml(vec3(loc.x, 0.7, loc.y+1.0)), loc.y);
  vec3 col = vec3(0.0);
  
  vec3 rd = normalize(vec3(sp.xy,1.0));
  //rd = normalize(rd);
  float t = intersect(ro, rd);

  if (t>=(25.0*fog)) {
    col = vec3(0.7, 0.7, 1.0);
  } else {
    vec3 n = calcNormal(ro+t*rd, t);
    col = material(ro+t*rd, n, t);
  }
  
  gl_FragColor = vec4(col, 1.0);
}