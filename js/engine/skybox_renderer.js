import { load_image } from './utils.js';
import { load_shader_from_dir, set_uniform_mat4 } from './shader.js';
import { draw_model_indices } from './base_renderer.js';
import { create_indices_buffer } from './mesh_generator.js';

const { mat4 } = glMatrix;

let model;
let texture;
let shader;

export async function init_skybox_renderer(gl){
	texture = await load_cubemap_from_file(gl, 'res/textures/skybox/');
	shader = await load_shader_from_dir(gl, 'res/shaders/skybox_shader/');
	model = init_cube_model(gl);
}

export function draw_skybox(gl, scene){
	const camera = scene.camera;

	gl.useProgram(shader.program);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

	set_uniform_mat4(gl, shader, 'projection', camera.projection);
	const our_mat = mat4.clone(camera.view);

	// Removing the translation from the cameras view matrix
	our_mat[12] = 0;
	our_mat[13] = 0;
	our_mat[14] = 0;

	set_uniform_mat4(gl, shader, 'view', our_mat);

	gl.depthMask(false);
	draw_model_indices(gl, model);
	gl.depthMask(true);
}

function init_cube_model(gl){
	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	// Creating the positions buffer
	const pos_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pos_buff);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
	const positions = [
		-1, -1, 1,
		-1, 1, 1,
		1, 1, 1,
		1, -1, 1,

		-1, -1, -1,
		-1, 1, -1,
		1, 1, -1,
		1, -1, -1,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	const indices = [
		0, 1, 2, 0, 2, 3,
		4, 5, 1, 4, 1, 0,
		3, 2, 6, 3, 6, 7,
		1, 5, 6, 1, 6, 2,
		7, 6, 5, 7, 5, 4,
		4, 0, 7, 7, 0, 3,
	];
	const indices_buffer = create_indices_buffer(gl, indices);

	return {
		vao,
		indices_buffer,
	};
}

async function load_cubemap_from_file(gl, path_to_file){
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	const image_order = [
		'bottom',
		'front',
		'top',
		'back',
		'right',
		'left',
	];

	for(let i = 0; i < 6; i++){
		const image = await load_image(path_to_file + image_order[i] + '.jpg');
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	}

	return texture;
}