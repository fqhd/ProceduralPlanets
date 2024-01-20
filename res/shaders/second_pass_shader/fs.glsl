#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_normal;
in vec3 pass_position;
in vec3 pass_cam_pos;
in float pass_nmap_mix;
in float pass_color_mix;

layout (location = 0) out vec3 out_color;
layout (location = 1) out float out_depth;

uniform sampler2D normal_map_1;
uniform sampler2D normal_map_2;
uniform float texture_scale;
uniform float texture_strength;
uniform float grass_threshold;
uniform float snow_threshold;

const float BLEND_SHARPNESS = 5.5;
const float MAX_TEXTURE_SCALE = 20.0;
const float GRASS_THRESHOLD = 0.26;
const float SNOW_THRESHOLD = 0.3;

const vec3 light_dir = vec3(0.0, -1.0, -1.0);
uniform vec3 snow_color;
uniform vec3 grass_color;
uniform vec3 sand_color;
uniform vec3 dirt_color;

// Thanks to Sebastian Lague and Ben Golus for implementing the logic of this triplinar normal map calculation function
vec3 calc_fragment_normal(sampler2D normal_map) {
	// Sample normal maps(tangent space)
	float scale = texture_scale * MAX_TEXTURE_SCALE;
	vec3 tnormalX = texture(normal_map, vec2(0.0, 1.0) - pass_position.zy * scale).rgb * 2.0 - vec3(1.0);
	vec3 tnormalY = texture(normal_map, vec2(0.0, 1.0) - pass_position.xz * scale).rgb * 2.0 - vec3(1.0);
	vec3 tnormalZ = texture(normal_map, vec2(0.0, 1.0) - pass_position.xy * scale).rgb * 2.0 - vec3(1.0);

	// Swizzle surface normal to match tangent space and blend with normals from normal map
	tnormalX = vec3(tnormalX.xy + pass_normal.zy, tnormalX.z * pass_normal.x);
	tnormalY = vec3(tnormalY.xy + pass_normal.xz, tnormalY.z * pass_normal.y);
	tnormalZ = vec3(tnormalZ.xy + pass_normal.xy, tnormalZ.z * pass_normal.z);

	// Calculate blend weight
	vec3 weight = abs(pass_normal);
	weight.x = pow(weight.x, BLEND_SHARPNESS);
	weight.y = pow(weight.y, BLEND_SHARPNESS);
	weight.z = pow(weight.z, BLEND_SHARPNESS);
	weight /= dot(weight, vec3(1.0));

	// Swizzle tangent normals to match world normald and blend together
	return normalize(tnormalX.zyx * weight.x + tnormalY.xzy * weight.y + tnormalZ.xyz * weight.z);
}

vec3 get_nmap_normal(){
	vec3 normal1 = calc_fragment_normal(normal_map_1);
	vec3 normal2 = calc_fragment_normal(normal_map_2);
	return mix(normal1, normal2, pass_nmap_mix);
}

float LinearEyeDepth(float z) {
    return 1.0 / (gl_FragCoord.z + gl_FragCoord.w);
}

vec3 lerp(vec3 a, vec3 b, float f){
	f = clamp(f, 0.0, 1.0);
	return mix(a, b, f);
}

float calc_steepness(){
	float steepness = 1.0 - dot(pass_normal, normalize(pass_position));
	return steepness / 0.2;
}

vec3 get_color(){
	vec3 final_color;
	float steepness = calc_steepness();
	
	vec3 local_grass_color = lerp(grass_color, dirt_color, steepness);

	if (pass_color_mix < GRASS_THRESHOLD){
		final_color = lerp(sand_color, local_grass_color, pass_color_mix / GRASS_THRESHOLD);
	}else{
		final_color = lerp(local_grass_color, snow_color, (pass_color_mix - GRASS_THRESHOLD) / (SNOW_THRESHOLD - GRASS_THRESHOLD));
	}

	return final_color;
}


void main(){
	vec3 normal = get_nmap_normal();
	normal = mix(normal, pass_normal, 1.0 - texture_strength);

	float diffuse = dot(normalize(-light_dir), normalize(normal));
	diffuse = max(diffuse, 0.2);

	vec3 reflected_vector = reflect(normalize(light_dir), normal);
	vec3 to_camera_vector = normalize(pass_cam_pos - pass_position);
	float specular_factor = clamp(dot(reflected_vector, to_camera_vector), 0.0, 1.0);
	float specular = pow(specular_factor, 10.0);

	out_color = get_color() * diffuse + vec3(specular) * 0.2;
	out_depth = 1.0 / gl_FragCoord.w;
}