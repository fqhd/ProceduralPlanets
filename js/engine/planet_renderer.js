import { load_shader_from_dir, set_uniform_f, set_uniform_vec3, set_uniform_i, set_uniform_mat4 } from './shader.js';
import { generate_sphere, get_neighbouring_indices_array } from './sphere_generator.js';
import { load_texture_from_data, create_indices_texture, load_texture_from_file } from './texture.js';
import { draw_model_indices, load_camera_to_shader, bind_texture, draw_indices } from './base_renderer.js';
import { create_quad, create_indices_buffer } from './mesh_generator.js';
import { bind_default_framebuffer, bind_framebuffer } from './framebuffer.js';
import { create_planet_framebuffer } from './planet_framebuffer.js';
import { create_ocean_framebuffer } from './ocean_framebuffer.js';
import { deg_to_rad } from './maths.js';

const { mat4 } = glMatrix;

let sphere_texture;
let indices_texture;
let normal_map_texture_1;
let normal_map_texture_2;
let water_normal_map;
let sphere_indices_buffer;
let first_pass_shader;
let second_pass_shader;
let third_pass_shader;
let planet_framebuffer;
let ocean_framebuffer;
let quad;
let water_rotation_matrix_1;
let water_rotation_matrix_2;

export async function init_planet_renderer(gl){
	init_sphere(gl);
	await init_shaders(gl);
	await init_textures(gl);
	planet_framebuffer = create_planet_framebuffer(gl, sphere_texture.width, sphere_texture.height);
	ocean_framebuffer = create_ocean_framebuffer(gl, gl.canvas.clientWidth, gl.canvas.clientHeight);
	quad = create_quad(gl);
	water_rotation_matrix_1 = mat4.create();
	water_rotation_matrix_2 = mat4.create();
}

export function prepare_planet_rendering(gl, scene){
	first_pass(gl, scene);
	second_pass(gl, scene);
}

export function render_final_planet(gl, scene){
	third_pass(gl, scene);
}

function first_pass(gl, scene){
	bind_framebuffer(gl, planet_framebuffer);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.useProgram(first_pass_shader.program);
	bind_texture(gl, gl.TEXTURE0, sphere_texture.id);
	load_planet_params(gl, first_pass_shader, scene.planet_params.generation_params);
	draw_model_indices(gl, quad);
	bind_default_framebuffer(gl);
}

function second_pass(gl, scene){
	bind_framebuffer(gl, ocean_framebuffer);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.useProgram(second_pass_shader.program);
	load_camera_to_shader(gl, second_pass_shader, scene.camera);
	load_planet_params(gl, second_pass_shader, scene.planet_params.color_params);
	bind_texture(gl, gl.TEXTURE0, sphere_texture.id);
	bind_texture(gl, gl.TEXTURE1, planet_framebuffer.textures[0].id);
	bind_texture(gl, gl.TEXTURE2, indices_texture.id);
	bind_texture(gl, gl.TEXTURE3, normal_map_texture_1.id);
	bind_texture(gl, gl.TEXTURE4, normal_map_texture_2.id);
	draw_indices(gl, sphere_indices_buffer);
}

function third_pass(gl, scene){
	mat4.fromRotation(water_rotation_matrix_1, deg_to_rad(scene.time), [0, 1, 0]);
	mat4.fromRotation(water_rotation_matrix_2, deg_to_rad(scene.time), [1, 0, 0]);
	bind_default_framebuffer(gl);
	gl.useProgram(third_pass_shader.program);
	bind_texture(gl, gl.TEXTURE0, ocean_framebuffer.textures[0].id);
	bind_texture(gl, gl.TEXTURE1, ocean_framebuffer.textures[1].id);
	bind_texture(gl, gl.TEXTURE2, water_normal_map.id);
	set_uniform_mat4(gl, third_pass_shader, 'water_rotation_matrix_1', water_rotation_matrix_1);
	set_uniform_mat4(gl, third_pass_shader, 'water_rotation_matrix_2', water_rotation_matrix_2);
	load_planet_params(gl, third_pass_shader, scene.planet_params.water_params);
	load_camera_to_shader(gl, third_pass_shader, scene.camera);
	draw_model_indices(gl, quad);
}

function load_planet_params(gl, shader, params){
	for(const param_name in params){
		if(typeof params[param_name] == 'object') {
			set_uniform_vec3(gl, shader, param_name, params[param_name]);
		}else{
			set_uniform_f(gl, shader, param_name, params[param_name]);
		}
	}
}

function init_sphere(gl){
	const { positions, indices } = generate_sphere(8);
	sphere_indices_buffer = create_indices_buffer(gl, indices);
	sphere_texture = load_texture_from_data(gl, positions);
	const neighbouring_indices = get_neighbouring_indices_array(indices, positions.length/3);
	indices_texture = create_indices_texture(gl, neighbouring_indices);
}

async function init_shaders(gl){
	await init_first_pass_shader(gl);
	await init_second_pass_shader(gl);
	await init_third_pass_shader(gl);
}

async function init_first_pass_shader(gl){
	first_pass_shader = await load_shader_from_dir(gl, 'res/shaders/first_pass_shader/');
}

async function init_second_pass_shader(gl){
	second_pass_shader = await load_shader_from_dir(gl, 'res/shaders/second_pass_shader/');
	gl.useProgram(second_pass_shader.program);
	set_uniform_i(gl, second_pass_shader, 'sphere_texture', 0);
	set_uniform_i(gl, second_pass_shader, 'vertex_data_texture', 1);
	set_uniform_i(gl, second_pass_shader, 'indices_texture', 2);
	set_uniform_i(gl, second_pass_shader, 'normal_map_1', 3);
	set_uniform_i(gl, second_pass_shader, 'normal_map_2', 4);
	set_uniform_i(gl, second_pass_shader, 'sphere_texture_width', sphere_texture.width);
	set_uniform_i(gl, second_pass_shader, 'indices_texture_width', indices_texture.width);
}

async function init_third_pass_shader(gl){
	third_pass_shader = await load_shader_from_dir(gl, 'res/shaders/third_pass_shader/');
	gl.useProgram(third_pass_shader.program);
	set_uniform_i(gl, third_pass_shader, 'albedo_texture', 0);
	set_uniform_i(gl, third_pass_shader, 'depth_texture', 1);
	set_uniform_i(gl, third_pass_shader, 'normal_map', 2);
}

async function init_textures(gl){
	normal_map_texture_1 = await load_texture_from_file(gl, 'res/textures/perlinNormal.jpg');
	normal_map_texture_2 = await load_texture_from_file(gl, 'res/textures/rockNormal.jpg');
	water_normal_map = await load_texture_from_file(gl, 'res/textures/water_normal.jpg');
}