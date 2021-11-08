'use strict';

import {load_shaders, bind_shader_tex_attribs} from '/js/engine/shader.js';
import {load_textured_models, load_raw_models} from '/js/engine/model.js';
import {load_textures} from '/js/engine/texture.js';
import {draw_scene, init_gl_state} from '/js/engine/renderer.js';
import {create_camera} from '/js/engine/camera.js';
import {init_transform} from '/js/engine/transform.js';

export async function init(gl){
	const [shaders, textured_models, raw_models, textures] = await Promise.all([
		load_shaders(gl),
		load_textured_models(gl),
		load_raw_models(gl),
		load_textures(gl),
	]);

	init_gl_state(gl); // Initializing gl state out of promise
	bind_shader_tex_attribs(gl, shaders); // Send 0 or 1 to shader textures

	return {
		shaders,
		raw_entities: [
			{
				reflectivity: 2,
				shine_damper: 50,
				color: [0.5, 0.5, 0.5],
				model: raw_models.bunny,
				transform: init_transform([4, 1.75, -3], [0, -90, 0], [30, 30, 30]),
			}
		],
		normal_mapped_entities: [
			{
				reflectivity: 1,
				shine_damper: 10,
				model: textured_models.plane,
				texture: textures.bricks_texture,
				normal_map: textures.bricks_normal,
				transform: init_transform([0, 0, -7], [0, 90, 0], [50, 50, 50]),
			},
		],
		light: {
			position: [0, 1, -2],
			color: [1, 1, 1],
			attenuation: [0.4, 0.08, 0.08],
		},
		camera: create_camera([-3, 1.5, 3], 5, 20, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};
}

export function draw(gl, scene){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	draw_scene(gl, scene);
}
