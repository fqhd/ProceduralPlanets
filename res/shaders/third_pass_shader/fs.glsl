#version 300 es

#if(GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec2 pass_ndc_coords;

out vec4 out_color;

uniform sampler2D albedo_texture;
uniform sampler2D depth_texture;
uniform sampler2D normal_map;
uniform mat4 view;
uniform mat4 projection;
uniform float water_depth;
uniform mat4 water_rotation_matrix_1;
uniform mat4 water_rotation_matrix_2;

const vec3 light_dir = vec3(0.0, -1.0, -1.0);
const vec3 color_b = vec3(0.0, 0.0, 0.1);
const vec3 color_a = vec3(0.0, 0.4, 0.6);

// Thanks to Sebastian Lague and Ben Golus for implementing the logic of this triplinar normal map calculation function
vec3 calc_fragment_normal(sampler2D nmap, vec3 position, vec3 normal) {
	// Sample normal maps(tangent space)
	float scale = 20.0;
	float sharpness = 1.0;
	vec3 tnormalX = texture(nmap, vec2(0.0, 1.0) - position.zy * scale).rgb * 2.0 - vec3(1.0);
	vec3 tnormalY = texture(nmap, vec2(0.0, 1.0) - position.xz * scale).rgb * 2.0 - vec3(1.0);
	vec3 tnormalZ = texture(nmap, vec2(0.0, 1.0) - position.xy * scale).rgb * 2.0 - vec3(1.0);

	// Swizzle surface normal to match tangent space and blend with normals from normal map
	tnormalX = vec3(tnormalX.xy + normal.zy, tnormalX.z * normal.x);
	tnormalY = vec3(tnormalY.xy + normal.xz, tnormalY.z * normal.y);
	tnormalZ = vec3(tnormalZ.xy + normal.xy, tnormalZ.z * normal.z);

	// Calculate blend weight
	vec3 weight = abs(normal);
	weight.x = pow(weight.x, sharpness);
	weight.y = pow(weight.y, sharpness);
	weight.z = pow(weight.z, sharpness);
	weight /= dot(weight, vec3(1.0));

	// Swizzle tangent normals to match world normald and blend together
	return normalize(tnormalX.zyx * weight.x + tnormalY.xzy * weight.y + tnormalZ.xyz * weight.z);
}

// Ray sphere intersection function originally written by Sebastian Lague
vec2 ray_sphere(vec3 center, float radius, vec3 ray_origin, vec3 ray_dir) {
	vec3 offset = ray_origin - center;
	float a = 1.0;
	float b = 2.0 * dot(offset, ray_dir);
	float c = dot(offset, offset) - radius * radius;

	float discriminant = b*b-4.0*a*c;

	if(discriminant > 0.0) {
		float s = sqrt(discriminant);
		float dist_to_sphere_near = max(0.0, (-b - s) / (2.0 * a));
		float dist_to_sphere_far = (-b + s) / (2.0 * a);

		if(dist_to_sphere_far >= 0.0){
			return vec2(dist_to_sphere_near, dist_to_sphere_far - dist_to_sphere_near);
		}
	}

	return vec2(1000000.0, 0.0);
}

vec4 to_eye_coords(vec4 clip_coords){
	mat4 inverted_projection = inverse(projection);
	vec4 eye_coords = inverted_projection * clip_coords;
	return vec4(eye_coords.x, eye_coords.y, -1.0, 0.0);
}

vec3 to_world_coords(vec4 eye_coords){
	mat4 inverted_view = inverse(view);
	vec4 ray_world = inverted_view * eye_coords;
	vec3 mouse_ray = vec3(ray_world.x, ray_world.y, ray_world.z);
	return mouse_ray;
}

vec3 get_view_vector(){
	vec4 clip_coords = vec4(pass_ndc_coords.x, pass_ndc_coords.y, -1.0, 1.0);
	vec4 eye_coords = to_eye_coords(clip_coords);
	vec3 world_ray = to_world_coords(eye_coords);
	return world_ray;
}

vec3 get_cam_pos(){
	return (inverse(view) * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
}

vec3 get_nmap_normal(vec3 pos, vec3 sphere_normal){
	vec3 ocean_normal_1 = calc_fragment_normal(normal_map, mat3(water_rotation_matrix_1) * pos, sphere_normal);
	vec3 ocean_normal_2 = calc_fragment_normal(normal_map, mat3(water_rotation_matrix_2) * pos, sphere_normal);
	return mix(ocean_normal_1, ocean_normal_2, 0.5);
}

// Sphere-intersection inspired by Sebastian Lague
void main(){
	vec2 uv = (pass_ndc_coords + vec2(1.0)) / 2.0;
	vec3 original_color = texture(albedo_texture, uv).rgb;
	float depth = texture(depth_texture, uv).r;
	depth = depth * length(get_view_vector());

	vec3 ray_pos = get_cam_pos();
	vec3 ray_dir = normalize(get_view_vector());
	vec2 hit_info = ray_sphere(vec3(0.0), 1.2, ray_pos, ray_dir);
	float dist_to_ocean = hit_info.x;
	float dist_through_ocean = hit_info.y;
	float ocean_view_depth = min(dist_through_ocean, depth - dist_to_ocean);

	out_color = vec4(original_color, 1.0);
	if(ocean_view_depth > 0.0){
		float optical_depth = 1.0 - exp(-ocean_view_depth * water_depth * 10.0);

		// Lighting
		vec3 sphere_pos = ray_pos + ray_dir * dist_to_ocean;
		vec3 sphere_normal = normalize(sphere_pos);
		vec3 dir_to_sun = -normalize(light_dir);
		vec3 ocean_normal = get_nmap_normal(sphere_pos, sphere_normal);
		ocean_normal = mix(ocean_normal, sphere_normal, 0.5);
		vec3 reflected_vector = reflect(-dir_to_sun, ocean_normal);
		vec3 to_camera_vector = normalize(ray_pos - sphere_pos);
		float specular_factor = clamp(dot(reflected_vector, to_camera_vector), 0.0, 1.0);
		float specular = pow(specular_factor, 35.0);
		float diffuse = clamp(dot(ocean_normal, dir_to_sun), 0.2, 1.0);

		vec3 ocean_color = mix(color_a, color_b, optical_depth) * diffuse + vec3(specular);
		out_color = vec4(mix(ocean_color, original_color, 1.0 - clamp(optical_depth * 10.0, 0.0, 1.0)), 1.0);
	}
}