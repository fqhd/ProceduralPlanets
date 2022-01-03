#version 300 es

#if(GL_FRAGMENT_PRECISION_HIGH)
	precision highp float;
#else
	precision mediump float;
#endif

in vec3 pass_position;

layout (location = 0) out vec4 out_color;
layout (location = 1) out float out_depth;

uniform sampler2D ourTexture;
const float blend_sharpness = 5.5;

// Thanks to Sebastian Lague and Ben Golus for implementing the logic of this triplinar normal map calculation function
vec3 calc_fragment_color(vec3 pos, vec3 normal) {
	// Sample normal maps(tangent space)
	float scale = 2.0;
	vec3 colX = texture(ourTexture, pos.zy * scale).rgb;
	vec3 colY = texture(ourTexture, pos.xz * scale).rgb;
	vec3 colZ = texture(ourTexture, pos.xy * scale).rgb;

	vec3 blend_weight;
	blend_weight.x = pow(abs(normal.x), blend_sharpness);
	blend_weight.y = pow(abs(normal.y), blend_sharpness);
	blend_weight.z = pow(abs(normal.z), blend_sharpness);
	
	blend_weight /= dot(blend_weight, vec3(1.0));

	return colX * blend_weight.x + colY * blend_weight.y + colZ * blend_weight.z;
}

void main(){
	vec3 pos = normalize(pass_position);
	vec3 normal = normalize(pass_position);

	vec3 fragment_color = calc_fragment_color(pos, normal);
	out_color = vec4(fragment_color, 1.0);
	out_depth = 100.0;
}