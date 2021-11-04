'use strict';

export function init_gl_state(gl){
	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.DEPTH_TEST);
	gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
}

export function render_scene(gl, scene_data){
	draw_entities(gl, scene_data);
}

function draw_entities(gl, scene_data){
	const shader = scene_data.shaders.model_shader;
	const camera = scene_data.camera;
	const entities = scene_data.entities;

	gl.useProgram(shader.program);

	load_camera_to_shader(gl, shader, camera);

	for(const e of entities){
		draw_entity(gl, shader, e);
	}
}

function load_camera_to_shader(gl, shader, camera){
	gl.uniformMatrix4fv(shader.view_loc, false, camera.view);
	gl.uniformMatrix4fv(shader.proj_loc, false, camera.proj);
}

function draw_entity(gl, shader, entity){
	gl.bindTexture(gl.TEXTURE_2D, entity.texture);
	gl.uniformMatrix4fv(shader.model_loc, false, entity.transform.matrix);
	draw_model(gl, entity.model);
}

function draw_model(gl, model){
	gl.bindVertexArray(model.vao);
	gl.drawArrays(gl.TRIANGLES, 0, model.num_vertices);
}
