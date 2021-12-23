#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_normal;
in vec3 pass_position;
in float pass_color_mix_factor;

out vec4 out_color;

uniform sampler2D normal_map;
uniform vec3 obj_color_1;
uniform vec3 obj_color_2;
uniform float nmap_strength;
uniform float texture_scale;
uniform float blend_sharpness;

const vec3 light_dir = vec3(0.0, -1.0, -1.0);

// Thanks to Sebastian Lague and Ben Golus for implementing the logic of this triplinar normal map calculation function
vec3 calc_fragment_normal() {
	// Sample normal maps(tangent space)
	vec3 tnormalX = texture(normal_map, vec2(0, 1) - pass_position.zy * texture_scale).rgb * 2.0f - vec3(1.0f);
	vec3 tnormalY = texture(normal_map, vec2(0, 1) - pass_position.xz * texture_scale).rgb * 2.0f - vec3(1.0f);
	vec3 tnormalZ = texture(normal_map, vec2(0, 1) - pass_position.xy * texture_scale).rgb * 2.0f - vec3(1.0f);

	// Swizzle surface normal to match tangent space and blend with normals from normal map
	tnormalX = vec3(tnormalX.xy + pass_normal.zy, tnormalX.z * pass_normal.x);
	tnormalY = vec3(tnormalY.xy + pass_normal.xz, tnormalY.z * pass_normal.y);
	tnormalZ = vec3(tnormalZ.xy + pass_normal.xy, tnormalZ.z * pass_normal.z);

	// Calculate blend weight
	vec3 weight = abs(pass_normal);
	weight.x = pow(weight.x, blend_sharpness);
	weight.y = pow(weight.y, blend_sharpness);
	weight.z = pow(weight.z, blend_sharpness);
	weight /= dot(weight, vec3(1.0f));

	// Swizzle tangent normals to match world normald and blend together
	return normalize(tnormalX.zyx * weight.x + tnormalY.xzy * weight.y + tnormalZ.xyz * weight.z);
}

vec3 get_strengthened_nmap_normal(){
	vec3 normal = calc_fragment_normal();
	return mix(pass_normal, normal, nmap_strength);
}

vec3 get_obj_color(){
	return mix(obj_color_1, obj_color_2, pass_color_mix_factor);
}

void main(){
	vec3 fragment_normal = get_strengthened_nmap_normal();

	float brightness = dot(-normalize(light_dir), normalize(fragment_normal));
	brightness = max(brightness, 0.2);

	vec3 obj_color = get_obj_color();

	out_color = vec4(obj_color * brightness, 1.0);
}