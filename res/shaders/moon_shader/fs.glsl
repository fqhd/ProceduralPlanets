#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_normal;
in vec3 pass_position;

out vec4 out_color;

uniform sampler2D normal_map_1;
uniform sampler2D normal_map_2;

const vec3 light_dir = vec3(0.0, 0.0, -1.0);
const vec3 obj_color = vec3(0.7, 0.2, 1.0);

const float texture_scale = 1.0f;
const float blend_sharpness = 7.0f;

// Thanks to Sebastian Lague and Ben Golus for implementing the logic of this triplinar normal map calculation function
vec3 calc_fragment_normal(sampler2D normal_map) {
	// Sample normal maps(tangent space)
	vec3 tnormalX = texture(normal_map, pass_position.zy * texture_scale).rgb * 2.0f - vec3(1.0f);
	vec3 tnormalY = texture(normal_map, pass_position.xz * texture_scale).rgb * 2.0f - vec3(1.0f);
	vec3 tnormalZ = texture(normal_map, pass_position.xy * texture_scale).rgb * 2.0f - vec3(1.0f);

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

void main(){
	vec3 fragment_normal = calc_fragment_normal(normal_map_1);

	float brightness = dot(-light_dir, normalize(fragment_normal));
	brightness = max(brightness, 0.2);

	out_color = vec4(obj_color * brightness, 1.0);
}