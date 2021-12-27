import { set_uniform_i } from './shader.js';
import { generate_sphere } from './sphere_generator.js';
import { load_texture_from_data } from './texture.js';
import { draw_model_indices, load_camera_to_shader, bind_texture, draw_indices } from './base_renderer.js';
import { load_shader_from_dir } from './shader.js';
import { create_quad, create_indices_buffer } from './mesh_generator.js';
import { create_framebuffer, bind_default_framebuffer, bind_framebuffer } from './framebuffer.js';

let sphere_texture;
let sphere_indices_buffer;
let first_pass_shader;
let second_pass_shader;
let framebuffer;
let quad;

export async function init_moon_renderer(gl){
	init_sphere(gl);
	await init_shaders(gl);
	framebuffer = create_framebuffer(gl, sphere_texture.width, sphere_texture.height);
	quad = create_quad(gl);
}

export function draw_moon(gl, scene){
	first_pass(gl);
	second_pass(gl, scene);
}

function first_pass(gl){
	bind_framebuffer(gl, framebuffer);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.useProgram(first_pass_shader.program);
	load_sphere_texture(gl, first_pass_shader);
	draw_model_indices(gl, quad);
	bind_default_framebuffer(gl);
}

function second_pass(gl, scene){
	gl.useProgram(second_pass_shader.program);
	load_camera_to_shader(gl, second_pass_shader, scene.camera);
	load_sphere_texture(gl, second_pass_shader);
	// bind_scale_factor_texture(gl, moon.scale_factor_texture, shader);
	draw_indices(gl, sphere_indices_buffer);
}

function load_sphere_texture(gl, shader){
	bind_texture(gl, gl.TEXTURE0, sphere_texture.id);
	set_uniform_i(gl, shader, 'sphere_texture_width', sphere_texture.width);
	set_uniform_i(gl, shader, 'sphere_texture_height', sphere_texture.height);
}

function init_sphere(gl){
	const { positions, indices } = generate_sphere(5);
	sphere_indices_buffer = create_indices_buffer(gl, indices);
	sphere_texture = load_texture_from_data(gl, positions);
}

async function init_shaders(gl){
	await init_first_pass_shader(gl);
	await init_second_pass_shader(gl);
}

async function init_first_pass_shader(gl){
	first_pass_shader = await load_shader_from_dir(gl, 'res/shaders/first_pass_shader/');
}

async function init_second_pass_shader(gl){
	second_pass_shader = await load_shader_from_dir(gl, 'res/shaders/second_pass_shader/');
}