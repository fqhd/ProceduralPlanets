#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec2 uv;

out float scale;

uniform sampler2D sphere_texture;
uniform float ocean_size;
uniform float ocean_depth;
uniform float ocean_floor;
uniform float mountain_height;
uniform float mountain_frequency;
uniform float mountain_scale;
uniform float detail_frequency;
uniform float detail_scale;

const float MIN_OCEAN_FLOOR = -0.8;
const float MAX_OCEAN_DEPTH = 5.0;
const float MAX_MOUNTAIN_FREQUENCY = 2.0;
const float MAX_MOUNTAIN_HEIGHT = 1.0;
const float MAX_DETAIL_FREQUENCY = 12.0;

// Thanks to Patricio Gonzalez Vivo for making this noise function
// Source code can be found here: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
// Github of author: https://github.com/patriciogonzalezvivo?tab=repositories
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float fractal_noise(vec3 pos){
	float total = 0.0;
	float amplitude = 0.5;
	float frequency = 1.0;

	for(int i = 1; i <= 5; i++){
		total += noise(pos * frequency) * amplitude;
		amplitude *= 0.5;
		frequency *= 2.0;
	}
	return total;
}

float ridge_noise(vec3 pos){
	float func1 = noise(pos);
	float func2 = 1.0 - noise(pos);
	float r = min(func1, func2) * 2.0;
	return r - fractal_noise(pos) * 0.3;
}

/*
	Sebastian Lague is the original author of the following smoothMin() and smoothMax() functions.
	Credit goes to him, the original source file containing these functions
	can be found here: https://github.com/SebLague/Solar-System/blob/Development/Assets/Scripts/Celestial/Shaders/Includes/Math.cginc
*/
// Smooth minimum of two values, controlled by smoothing factor k
// When k = 0, this behaves identically to min(a, b)
float smoothMin(float a, float b, float k) {
	k = max(0.0, k);
	// https://www.iquilezles.org/www/articles/smin/smin.htm
	float h = max(0.0, min(1.0, (b - a + k) / (2.0 * k)));
	return a * h + b * (1.0 - h) - k * h * (1.0 - h);
}

// Smooth maximum of two values, controlled by smoothing factor k
// When k = 0, this behaves identically to max(a, b)
float smoothMax(float a, float b, float k) {
	k = min(0.0, -k);
	float h = max(0.0, min(1.0, (b - a + k) / (2.0 * k)));
	return a * h + b * (1.0 - h) - k * h * (1.0 - h);
}

float planet_shape(vec3 pos){
	// Planet shape
	float height = fractal_noise(pos * detail_frequency * MAX_DETAIL_FREQUENCY) * detail_scale;

	// Mountains
	float mountain_noise = ridge_noise(pos * mountain_frequency * 10.0);
	mountain_noise -= 1.0 - mountain_height;
	mountain_noise *= mountain_scale * MAX_MOUNTAIN_HEIGHT;
	mountain_noise = max(mountain_noise, 0.0);
	height += mountain_noise;

	// Ocean
	float ocean_noise = fractal_noise(pos * 2.0);
	ocean_noise -= ocean_size;
	if(ocean_noise > 0.0){
		ocean_noise = 0.0;
	}
	ocean_noise *= ocean_depth * MAX_OCEAN_DEPTH;
	height += ocean_noise;
	height = max(height, MIN_OCEAN_FLOOR * (1.0 - ocean_floor));

	return height;
}

void main() {
	vec3 pos = texture(sphere_texture, uv).rgb;

	float height = planet_shape(pos);

	scale = 1.0 + height;
}