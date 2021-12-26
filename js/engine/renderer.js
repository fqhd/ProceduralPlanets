import { set_uniform_mat4, set_uniform_i } from './shader.js';
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

	bind_sphere_texture(gl, moon.sphere_texture, shader);
	
	draw_model_indices(gl, moon.model);
}

function bind_sphere_texture(gl, texture, shader){
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture.id);
	set_uniform_i(gl, shader, 'sphere_texture_width', texture.width);
	set_uniform_i(gl, shader, 'sphere_texture_height', texture.height);
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
