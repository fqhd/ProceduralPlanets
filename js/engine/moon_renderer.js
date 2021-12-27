import { set_uniform_i } from './shader.js';
import { generate_sphere } from './sphere_generator.js';
import { load_texture_from_data } from './texture.js';
import { draw_model_indices, load_camera_to_shader, bind_texture, draw_indices } from './base_renderer.js';
import { load_shader_from_dir } from './shader.js';

let sphere_texture;
let moon_shader;
let scale_factor_shader;
let ebo;
let framebuffer;
let scale_factor_texture;
let quad;

export async function init_moon_renderer(gl){
	const { positions, indices } = generate_sphere(5);
	ebo = init_ebo(gl, indices);
	sphere_texture = load_texture_from_data(gl, positions);
	moon_shader = await load_shader_from_dir(gl, 'res/shaders/moon_shader/');
	scale_factor_shader = await load_shader_from_dir(gl, 'res/shaders/scale_factor_shader/');
	init_scale_factor_texture(gl);
	init_framebuffer(gl);
	init_quad(gl);
}

function init_scale_factor_texture(gl){
	scale_factor_texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, scale_factor_texture);
	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, sphere_texture.width, sphere_texture.height, 0, gl.RED, gl.UNSIGNED_BYTE, null);
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R32F, sphere_texture.width, sphere_texture.height);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function init_framebuffer(gl){
	framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, scale_factor_texture, 0);
	gl.bindFramebuffer(gl.FRAMEBUFFER,  null);
}

function init_quad(gl){
	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	const positions = [
		0, 0,
		0, 1,
		1, 1,
		1, 0,
	];
	const indices = [
		0, 1, 2, 0, 2, 3
	];
	gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
	const indices_buff = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buff);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(positions), gl.STATIC_DRAW);
	quad = {
		vao,
		indices_buff,
		num_indices: indices.length,
	};
}

export function draw_moon(gl, scene){
	first_pass(gl);
	second_pass(gl, scene);
}

function first_pass(gl){
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.viewport(0, 0, scale_factor_texture.width, scale_factor_texture.height);

	gl.useProgram(scale_factor_shader.program);

	bind_sphere_texture(gl, scale_factor_shader);

	draw_model_indices(gl, quad);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
}

function second_pass(gl, scene){
	const camera = scene.camera;

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
