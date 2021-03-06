import { set_uniform_mat4 } from './shader.js';

export function init_gl_state(gl){
	gl.clearColor(1, 1, 1, 1);
	gl.enable(gl.DEPTH_TEST);
	gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
}

export function clear(gl){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function draw_indices(gl, buffer){
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.id);
	gl.drawElements(gl.TRIANGLES, buffer.num_indices, gl.UNSIGNED_INT, 0);
}

export function draw_model_indices(gl, model){
	gl.bindVertexArray(model.vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indices_buffer.id);
	gl.drawElements(gl.TRIANGLES, model.indices_buffer.num_indices, gl.UNSIGNED_INT, 0);
}

export function load_camera_to_shader(gl, shader, camera){
	set_uniform_mat4(gl, shader, 'projection', camera.projection);
	set_uniform_mat4(gl, shader, 'view', camera.view);
}

export function bind_texture(gl, attachment, id){
	gl.activeTexture(attachment);
	gl.bindTexture(gl.TEXTURE_2D, id);
}