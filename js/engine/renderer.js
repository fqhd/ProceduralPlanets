import { set_uniform_mat4, set_uniform_vec3, set_uniform_f } from './shader.js';
import { update_camera } from './camera.js';

const {mat4} = glMatrix;

export function init_gl_state(gl){
	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.DEPTH_TEST);
	gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
}

export function draw_scene(gl, scene){
	clear(gl);
	
	update_camera(scene.camera);

	draw_moon(gl, scene);
	draw_skybox(gl, scene);
}

function clear(gl){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function draw_moon(gl, scene){
	const shader = scene.shaders.moon_shader;
	const {camera, moon} = scene;

	gl.useProgram(shader.program);

	load_camera_to_shader(gl, shader, camera);
	
	load_moon_params(gl, shader, moon.params);

	bind_texture(gl, moon.normal_map, gl.TEXTURE0);

	draw_model_indices(gl, moon.model);
}

function load_moon_params(gl, shader, moon_params){
	const { obj_color_1, obj_color_2, nmap_strength,
		blend_sharpness, texture_scale } = moon_params;

	set_uniform_vec3(gl, shader, 'obj_color_1', obj_color_1);
	set_uniform_vec3(gl, shader, 'obj_color_2', obj_color_2);

	set_uniform_f(gl, shader, 'nmap_strength', nmap_strength);
	set_uniform_f(gl, shader, 'blend_sharpness', blend_sharpness);
	set_uniform_f(gl, shader, 'texture_scale', texture_scale);
}

function bind_texture(gl, texture, attachment){
	gl.activeTexture(attachment);
	gl.bindTexture(gl.TEXTURE_2D, texture);
}

function draw_skybox(gl, scene){
	const shader = scene.shaders.skybox_shader;
	const {camera, skybox} = scene;

	gl.useProgram(shader.program);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox.texture);

	set_uniform_mat4(gl, shader, 'projection', camera.projection);
	const our_mat = mat4.clone(camera.view);

	// Removing the translation from the cameras view matrix
	our_mat[12] = 0;
	our_mat[13] = 0;
	our_mat[14] = 0;

	set_uniform_mat4(gl, shader, 'view', our_mat);

	gl.depthMask(false);
	draw_model_indices(gl, skybox.model);
	gl.depthMask(true);
}

function load_camera_to_shader(gl, shader, camera){
	set_uniform_mat4(gl, shader, 'projection', camera.projection);
	set_uniform_mat4(gl, shader, 'view', camera.view);
}

function draw_model_indices(gl, model){
	gl.bindVertexArray(model.vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indices_buff);
	gl.drawElements(gl.TRIANGLES, model.num_indices, gl.UNSIGNED_INT, 0);
}
