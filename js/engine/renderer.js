'use strict';

const {mat4} = glMatrix;

export async function init_gl_state(gl){
	gl.clearColor(0, 0, 0, 1);
	gl.frontFace(gl.CW);
	gl.disable(gl.CULL_FACE);
	gl.viewport(0, 0, 300, 300);
}

export function render_scene(gl, scene_data){
	gl.useProgram(scene_data.shader.program);
	draw_entity(gl, scene_data.shader, scene_data.entity);
}

function draw_entity(gl, shader, entity){
	const model_matrix = mat4.create();
	mat4.translate(model_matrix, model_matrix, entity.position);
	gl.uniformMatrix4fv(shader.model_loc, false, model_matrix);
	draw_model(gl, entity.model);
}

function draw_model(gl, model){
	gl.bindVertexArray(model.vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indices_buff);
	gl.drawElements(gl.TRIANGLES, model.num_indices, gl.UNSIGNED_SHORT, 0);
}
