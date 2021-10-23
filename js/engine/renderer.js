'use strict';

export async function init_gl_state(gl){
	gl.clearColor(0, 0, 0, 1);
	gl.frontFace(gl.CW);
	gl.disable(gl.CULL_FACE);
}

export function render_scene(gl, scene_data){
	gl.useProgram(scene_data.shader.program);
	draw_model(gl, scene_data.entity.model);
}

function draw_model(gl, model){
	gl.bindVertexArray(model.vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indices_buff);
	gl.drawElements(gl.TRIANGLES, model.num_indices, gl.UNSIGNED_SHORT, 0);
}
