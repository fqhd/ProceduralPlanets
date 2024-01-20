#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec2 uv;

out vec2 data;

uniform sampler2D sphere_texture;
uniform float noise_offset;
uniform float shape_frequency;
uniform float warp_factor;
uniform float mountain_frequency;
uniform float mountain_height;
uniform float ridge_noise_frequency;
uniform float ocean_depth;
uniform float base_height;

// Thanks to Patricio Gonzalez Vivo for making this noise function
// Source code can be found here: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
// Github of author: https://github.com/patriciogonzalezvivo?tab=repositories
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
float noise(vec3 p){
	p += noise_offset;
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

	for(int i = 1; i <= 8; i++){
		total += noise(pos * frequency) * amplitude;
		amplitude *= 0.5;
		frequency *= 2.0;
	}
	return total;
}

float smoothMax(float a, float b, float k) {
	k = min(0.0, -k);
	float h = max(0.0, min(1.0, (b - a + k) / (2.0 * k)));
	return a * h + b * (1.0 - h) - k * h * (1.0 - h);
}

float warpedNoise(vec3 pos, float warpFactor) {
	return noise(pos + noise(pos) * warpFactor);
}

float ridgeNoise(vec3 pos) {
	float n = noise(pos * 2.0);
	n = n * 2.0 - 1.0;
	return 1.0 - abs(n); 
}

float get_height_from_pos(vec3 pos){
	float height = base_height;



	// General Shape
	float continentShape = warpedNoise(pos * shape_frequency, warp_factor) * 0.5;
	height += continentShape; 

	// Mountains
	float mountainShape = fractal_noise(pos * mountain_frequency) * mountain_height;
	height += mountainShape;
	
	height *= 0.5;

	// Water
	float oceanShape = ridgeNoise(pos * ridge_noise_frequency + 200.0) * ocean_depth;
	height -= oceanShape;

	return height;
}

void main() {
	vec3 pos = texture(sphere_texture, uv).rgb;

	float height = get_height_from_pos(pos);

	data.r = 1.0 + height; // Vertex height
	data.g = noise(pos * 1.0); // Normal Map mixing values
}