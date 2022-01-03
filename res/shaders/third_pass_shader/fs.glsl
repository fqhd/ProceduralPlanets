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
uniform mat4 view;
uniform mat4 projection;
uniform float water_depth;

const vec3 color_b = vec3(0.0, 0.0, 0.1);
const vec3 color_a = vec3(0.0, 0.4, 0.6);

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

float LinearEyeDepth(float z) {
    return 1.0 / (gl_FragCoord.z + gl_FragCoord.w);
}

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
		vec3 ocean_color = mix(color_a, color_b, optical_depth);
		out_color = vec4(ocean_color, 1.0);
	}
}