#version 300 es

#if(GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_to_camera_vector;
in vec3 pass_to_light_vector;
in vec3 pass_normal;
in vec2 pass_uv;

out vec4 out_color;

uniform float shine_damper;
uniform float reflectivity;
uniform sampler2D our_texture;
uniform sampler2D our_normal_map;
uniform vec3 light_color;


void main(){
	vec3 fragment_color = texture(our_texture, pass_uv).rgb;

	// Diffuse
	float brightness = dot(normalize(pass_to_light_vector), normalize(pass_normal));
	brightness = clamp(brightness, 0.2, 1.0);

	// Specular
	vec3 light_dir = -pass_to_light_vector;
	vec3 reflected_light_dir = reflect(normalize(light_dir), normalize(pass_normal));
	float spec_factor = dot(normalize(reflected_light_dir), normalize(pass_to_camera_vector));
	spec_factor = max(spec_factor, 0.0);
	float damp_factor = pow(spec_factor, shine_damper);
	vec3 final_specular = damp_factor * reflectivity * light_color;

	out_color = vec4(fragment_color * brightness + final_specular, 1.0);
}
