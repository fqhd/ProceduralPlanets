#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_normal;
in vec3 pass_position;
in float pass_nmap_mix;

out vec4 out_color;

const vec3 light_dir = vec3(0.0, 0.0, -1.0);

uniform sampler2D normal_map_1;
uniform sampler2D normal_map_2;
uniform float texture_scale;

const float blend_sharpness = 5.5;
const float MAX_TEXTURE_SCALE = 20.0;

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
	weight.x = pow(weight.x, blend_sharpness);
	weight.y = pow(weight.y, blend_sharpness);
	weight.z = pow(weight.z, blend_sharpness);
	weight /= dot(weight, vec3(1.0));

	// Swizzle tangent normals to match world normald and blend together
	return normalize(tnormalX.zyx * weight.x + tnormalY.xzy * weight.y + tnormalZ.xyz * weight.z);
}

vec3 get_mixed_normal(){
	vec3 normal1 = calc_fragment_normal(normal_map_1);
	vec3 normal2 = calc_fragment_normal(normal_map_2);
	return mix(normal1, normal2, pass_nmap_mix);
}

void main(){
	vec3 normal = get_mixed_normal();

	float brightness = dot(-normalize(light_dir), normalize(normal));
	brightness = max(brightness, 0.2);

	vec3 obj_color = vec3(1.0, 1.0, 1.0);

	out_color = vec4(obj_color * brightness, 1.0);
}