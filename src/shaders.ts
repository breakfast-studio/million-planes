export const vert = `
uniform float time;
attribute float idx;
float columns = 200.;
varying float vYpos;

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

void main() {
    vec3 spacer = vec3(1.5, 1., 1.5);
    vec2 ground = vec2(
        mod(idx, columns) - columns * 0.5, 
        floor(idx / columns) * 1.
    );
    float scale = 3.;
    vec3 translate = vec3(
        ground.x, 
        noise((ground + vec2(0., time * 0.1)) * 0.1) * scale, 
        ground.y
    ) * spacer;
    vYpos = translate.y / scale;
	vec4 pos = projectionMatrix * modelViewMatrix * vec4( position + translate, 1.0 );

    gl_Position = pos;
}`

export const frag = `
varying float vYpos;

void main() {
	gl_FragColor = vec4(vec3(vYpos), 1.);
}`
