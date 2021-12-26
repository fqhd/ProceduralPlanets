import { set_uniform_i } from './shader.js';
import { generate_sphere } from './sphere_generator.js';
import { load_texture_from_data } from './texture.js';
import { draw_model_indices, load_camera_to_shader, bind_texture, draw_indices } from './base_renderer.js';
import { load_shader_from_dir } from './shader.js';

let sphere_texture;
let moon_shader;
let scale_factor_shader;
let ebo;

export async function init_moon_renderer(gl){
	const { positions, indices } = generate_sphere(5);
	ebo = init_ebo(gl, indices);
	sphere_texture = load_texture_from_data(gl, positions);
	moon_shader = await load_shader_from_dir(gl, 'res/shaders/moon_shader/');
	scale_factor_shader = await load_shader_from_dir(gl, 'res/shaders/scale_factor_shader/');
}

export function draw_moon(gl, scene){
	// first_pass(gl, scene);
	second_pass(gl, scene);
}

function first_pass(gl, scene){
	// Bind framebuffer

	// Bind sphere texture
	
	gl.useProgram(moon_shader.program);

	bind_sphere_texture(gl, sphere_texture, shader);

	draw_model_indices(gl, moon.quad);
}

function second_pass(gl, scene){
	const {camera} = scene;

	gl.useProgram(moon_shader.program);

	load_camera_to_shader(gl, moon_shader, camera);

	bind_sphere_texture(gl, moon_shader);
	// bind_scale_factor_texture(gl, moon.scale_factor_texture, shader);
	
	draw_indices(gl, ebo);
}

function bind_sphere_texture(gl, shader){
	bind_texture(gl, gl.TEXTURE0, sphere_texture.id);
	set_uniform_i(gl, shader, 'sphere_texture_width', sphere_texture.width);
	set_uniform_i(gl, shader, 'sphere_texture_height', sphere_texture.height);
}

function init_ebo(gl, indices){
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
	return {
		buffer,
		num_indices: indices.length,
	};
}