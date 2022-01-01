#version 300 es

#if (GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_normal;
in vec3 pass_position;
in float pass_nmap_mix;
in vec3 cam_pos;

out vec4 out_color;

const vec3 light_dir = vec3(0.0, -1.0, -1.0);

uniform sampler2D normal_map_1;
uniform sampler2D normal_map_2;
uniform float texture_scale;
uniform float texture_strength;
uniform float depth_multiplier;
uniform float alpha_multiplier;
uniform float ocean_height;

const float blend_sharpness = 5.5;
const float MAX_TEXTURE_SCALE = 20.0;
const float MAX_DEPTH = 10.0;
const float MAX_ALPHA = 50.0;
const float MAX_OCEAN_HEIGHT = 0.5;

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

vec3 get_nmap_normal(){
	vec3 normal1 = calc_fragment_normal(normal_map_1);
	vec3 normal2 = calc_fragment_normal(normal_map_2);
	return mix(normal1, normal2, pass_nmap_mix);
}

vec2 ray_sphere(vec3 center, float radius, vec3 ray_origin, vec3 ray_dir){
	vec3 offset = ray_origin - center;
	float a = 1.0;
	float b = 2.0 * dot(offset, ray_dir);
	float c = dot(offset, offset) - radius * radius;

	float discriminant = b*b-4.0*a*c;

	if(discriminant > 0.0){
		float s = sqrt(discriminant);
		float dist_to_sphere_near = max(0.0, (-b - s) / (2.0 * a));
		float dist_to_sphere_far = (-b + s) / (2.0 * a);
		if(dist_to_sphere_far >= 0.0){
			return vec2(dist_to_sphere_near, dist_to_sphere_far - dist_to_sphere_near);
		}
	}

	return vec2(1000000.0, 0.0);
}

float LinearEyeDepth(float z) {
    return 1.0 / (gl_FragCoord.z * z + gl_FragCoord.w);
}

void main(){
	vec3 normal = get_nmap_normal();
	normal = mix(normal, pass_normal, 1.0 - texture_strength);

	float brightness = dot(-normalize(light_dir), normalize(normal));
	brightness = max(brightness, 0.1);

	vec3 ray_pos = cam_pos;
	vec3 ray_dir = normalize(pass_position - cam_pos);
	vec2 hit_info = ray_sphere(vec3(0.0), 0.5 + ocean_height * MAX_OCEAN_HEIGHT, ray_pos, ray_dir);
	float dist_to_ocean = hit_info.x;
	float dist_through_ocean = hit_info.y;

// 	float ndcDepth = ndcPos.z = (2.0 * gl_FragCoord.z - gl_DepthRange.near - gl_DepthRange.far) / (gl_DepthRange.far - gl_DepthRange.near);
// float clipDepth = ndcDepth / gl_FragCoord.w;
// gl_FragColor = vec4((clipDepth * 0.5) + 0.5); 

	float ocean_view_depth = min(dist_through_ocean, 1.0/gl_FragCoord.w - dist_to_ocean);

	vec3 color_b = vec3(0.0, 0.05, 0.1);
	vec3 color_a = vec3(0.0, 0.6, 1.0);
	vec3 obj_color = vec3(1.0, 0.9, 0.8);

	out_color = vec4(obj_color * brightness, 1.0);

	if(ocean_view_depth > 0.0){
		float optical_depth = 1.0 - exp(-ocean_view_depth * depth_multiplier * MAX_DEPTH);
		float alpha = 1.0 - exp(-ocean_view_depth * alpha_multiplier * MAX_ALPHA);
		vec3 ocean_color = mix(color_a, color_b, optical_depth);
		out_color = vec4(mix(out_color.rgb, ocean_color, alpha), 1.0);
	}

}