import { set_uniform_mat4 } from './shader.js';
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
	update_camera(scene.camera);

	draw_planet(gl, scene);
	draw_skybox(gl, scene);
}

function draw_planet(gl, scene){
	const shader = scene.shaders.planet_shader;
	const {camera, planet} = scene;

	gl.useProgram(shader.program);

	load_camera_to_shader(gl, shader, camera);

	draw_model_points(gl, planet.model);
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
	our_mat[15] = 1; // Might not need this

	set_uniform_mat4(gl, shader, 'view', our_mat);

	gl.depthMask(false);
	draw_model_indices(gl, skybox.model);
	gl.depthMask(true);
}

function load_camera_to_shader(gl, shader, camera){
	set_uniform_mat4(gl, shader, 'projection', camera.projection);
	set_uniform_mat4(gl, shader, 'view', camera.view);
}

function draw_model_points(gl, model){
	gl.bindVertexArray(model.vao);
	gl.drawArrays(gl.POINTS, 0, model.num_vertices);
}

function draw_model_indices(gl, model){
	gl.bindVertexArray(model.vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indices_buff);
	gl.drawElements(gl.TRIANGLES, model.num_indices, gl.UNSIGNED_SHORT, 0);
}
