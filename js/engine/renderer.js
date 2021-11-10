'use strict';

import { update_transform } from './transform.js';
import { set_uniform_mat4, set_uniform_vec3, set_uniform_f } from './shader.js';
import { update_camera } from './camera.js';

export function init_gl_state(gl){
	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.DEPTH_TEST);
	gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
}

export function draw_scene(gl, scene){
	update_camera(scene.camera);

	draw_raw_entities(gl, scene);
	draw_normal_mapped_entities(gl, scene);
}

function draw_raw_entities(gl, scene){
	const shader = scene.shaders.raw_entity_shader;
	const entities = scene.raw_entities;
	const {lights, camera} = scene;

	gl.useProgram(shader.program);

	load_lights_to_shader(gl, shader, lights);
	load_camera_to_shader(gl, shader, camera);

	entities.forEach(e => {
		draw_raw_entity(gl, shader, e);
	});
}

function draw_raw_entity(gl, shader, entity){
	set_uniform_vec3(gl, shader, 'object_color', entity.color);
	set_uniform_f(gl, shader, 'reflectivity', entity.reflectivity);
	set_uniform_f(gl, shader, 'shine_damper', entity.shine_damper);

	update_transform(entity.transform);

	set_uniform_mat4(gl, shader, 'model', entity.transform.matrix);
	draw_model_indices(gl, entity.model);
}

function draw_normal_mapped_entities(gl, scene){
	const shader = scene.shaders.normal_mapped_entity_shader;
	const entities = scene.normal_mapped_entities;
	const {lights, camera} = scene;

	gl.useProgram(shader.program);

	load_lights_to_shader(gl, shader, lights);
	load_camera_to_shader(gl, shader, camera);

	entities.forEach(e => {
		draw_normal_mapped_entity(gl, shader, e);
	});
}

function load_lights_to_shader(gl, shader, lights){
	for(let i = 0; i < lights.length; i++){
		set_uniform_vec3(gl, shader, 'light_position[' + i + ']', lights[i].position);
		set_uniform_vec3(gl, shader, 'light_color[' + i + ']', lights[i].color);
		set_uniform_vec3(gl, shader, 'light_attenuation[' + i + ']', lights[i].attenuation);
	}
	
}

function load_camera_to_shader(gl, shader, camera){
	set_uniform_mat4(gl, shader, 'projection', camera.projection);
	set_uniform_mat4(gl, shader, 'view', camera.view);
	set_uniform_vec3(gl, shader, 'camera_position', camera.position);
}

function draw_normal_mapped_entity(gl, shader, entity){
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, entity.texture);

	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, entity.normal_map);

	set_uniform_f(gl, shader, 'reflectivity', entity.reflectivity);
	set_uniform_f(gl, shader, 'shine_damper', entity.shine_damper);

	update_transform(entity.transform);

	set_uniform_mat4(gl, shader, 'model', entity.transform.matrix);
	draw_model_arrays(gl, entity.model);
}

function draw_model_arrays(gl, model){
	gl.bindVertexArray(model.vao);
	gl.drawArrays(gl.TRIANGLES, 0, model.num_vertices);
}

function draw_model_indices(gl, model){
	gl.bindVertexArray(model.vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indices_buff);
	gl.drawElements(gl.TRIANGLES, model.num_indices, gl.UNSIGNED_SHORT, 0);
}