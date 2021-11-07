'use strict';

import {load_shaders, bind_shader_tex_attribs} from '/js/engine/shader.js';
import {load_models} from '/js/engine/model.js';
import {load_textures} from '/js/engine/texture.js';
import {draw_scene, init_gl_state} from '/js/engine/renderer.js';
import {create_camera} from '/js/engine/camera.js';
import {init_transform} from '/js/engine/transform.js';

export async function init(gl){
	const [shaders, models, textures] = await Promise.all([
		load_shaders(gl),
		load_models(gl),
		load_textures(gl),
	]);

	init_gl_state(gl); // Initializing gl state out of promise
	bind_shader_tex_attribs(gl, shaders); // Send 0 or 1 to shader textures

	return {
		shaders,
		normal_mapped_entities: [
			{
				reflectivity: 1,
				shine_damper: 10,
				model: models.bunny,
				texture: textures.bricks_texture,
				normal_map: textures.bricks_normal,
				transform: init_transform([-2, 0, -8], [0, 0, 0], [4, 4, 4]),
			},
			{
				reflectivity: 1,
				shine_damper: 10,
				model: models.plane,
				texture: textures.bricks_texture,
				normal_map: textures.bricks_normal,
				transform: init_transform([0, 0, -5], [0, 0, 0], [10, 10 ,10]),
			},
		],
		light: {
			position: [0, 20, -10],
			color: [1, 1, 1],
		},
		camera: create_camera([0, 20, 16], 35, 0, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};
}

export function draw(gl, scene){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	scene.normal_mapped_entities[0].transform.rotation[1] += 1;

	draw_scene(gl, scene);
}
