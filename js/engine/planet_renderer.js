import { load_shader_from_dir, set_uniform_f, set_uniform_i } from './shader.js';
import { generate_sphere, get_neighbouring_indices_array } from './sphere_generator.js';
import { load_texture_from_data, create_indices_texture } from './texture.js';
import { draw_model_indices, load_camera_to_shader, bind_texture, draw_indices } from './base_renderer.js';
import { create_quad, create_indices_buffer } from './mesh_generator.js';
import { create_framebuffer, bind_default_framebuffer, bind_framebuffer } from './framebuffer.js';

let sphere_texture;
let indices_texture;
let sphere_indices_buffer;
let first_pass_shader;
let second_pass_shader;
let framebuffer;
let quad;

export async function init_planet_renderer(gl){
	init_sphere(gl);
	await init_shaders(gl);
	framebuffer = create_framebuffer(gl, sphere_texture.width, sphere_texture.height);
	quad = create_quad(gl);
}

export function draw_planet(gl, scene){
	first_pass(gl, scene);
	second_pass(gl, scene);
}

function first_pass(gl, scene){
	bind_framebuffer(gl, framebuffer);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.useProgram(first_pass_shader.program);
	bind_texture(gl, gl.TEXTURE0, sphere_texture.id);
	load_planet_params(gl, scene.planet_params);
	draw_model_indices(gl, quad);
	bind_default_framebuffer(gl);
}

function second_pass(gl, scene){
	gl.useProgram(second_pass_shader.program);
	load_camera_to_shader(gl, second_pass_shader, scene.camera);
	bind_texture(gl, gl.TEXTURE0, sphere_texture.id);
	bind_texture(gl, gl.TEXTURE1, framebuffer.texture.id);
	bind_texture(gl, gl.TEXTURE2, indices_texture.id);
	draw_indices(gl, sphere_indices_buffer);
}

function load_planet_params(gl, planet_params){
	set_uniform_f(gl, first_pass_shader, 'ocean_size', planet_params.ocean_size);
	set_uniform_f(gl, first_pass_shader, 'ocean_depth', planet_params.ocean_depth);
	set_uniform_f(gl, first_pass_shader, 'ocean_floor', planet_params.ocean_floor);
	set_uniform_f(gl, first_pass_shader, 'mountain_height', planet_params.mountain_height);
	set_uniform_f(gl, first_pass_shader, 'mountain_frequency', planet_params.mountain_frequency);
	set_uniform_f(gl, first_pass_shader, 'mountain_scale', planet_params.mountain_scale);
}

function init_sphere(gl){
	const { positions, indices } = generate_sphere(7);
	sphere_indices_buffer = create_indices_buffer(gl, indices);
	sphere_texture = load_texture_from_data(gl, positions);
	const neighbouring_indices = get_neighbouring_indices_array(indices, positions.length/3);
	indices_texture = create_indices_texture(gl, neighbouring_indices);
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
	gl.useProgram(second_pass_shader.program);
	set_uniform_i(gl, second_pass_shader, 'sphere_texture', 0);
	set_uniform_i(gl, second_pass_shader, 'scale_texture', 1);
	set_uniform_i(gl, second_pass_shader, 'indices_texture', 2);
	set_uniform_i(gl, second_pass_shader, 'sphere_texture_width', sphere_texture.width);
	set_uniform_i(gl, second_pass_shader, 'indices_texture_width', indices_texture.width);
}