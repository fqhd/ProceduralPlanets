'use strict';

export async function init_gl_state(gl){
	gl.clearColor(0, 0, 0, 1);
	gl.disable(gl.CULL_FACE);
}

export function render_scene(gl, scene_data){
	gl.useProgram(scene_data.shaders.model_shader.program);

	load_camera_to_shader(gl, scene_data.shaders.model_shader, scene_data.camera);

	draw_entity(gl, scene_data.shaders.model_shader, scene_data.entity);
}

function load_camera_to_shader(gl, shader, camera){
	gl.uniformMatrix4fv(shader.view_loc, false, camera.view);
	gl.uniformMatrix4fv(shader.proj_loc, false, camera.proj);
}

function draw_entity(gl, shader, entity){
	gl.uniformMatrix4fv(shader.model_loc, false, entity.transform.matrix);
	draw_model(gl, entity.model);
}

function draw_model(gl, model){
	gl.bindVertexArray(model.vao);
	gl.drawArrays(gl.TRIANGLES, 0, model.num_vertices);
}
