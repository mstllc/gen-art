precision highp float;
varying vec3 vpos;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: dither = require(glsl-dither/2x2)

void main () {
  float noise = snoise3((vpos * 1.5) * vec3(1.5, 8, 1));
  vec4 color = vec4(noise, noise, noise, 1);
  gl_FragColor = color;
}