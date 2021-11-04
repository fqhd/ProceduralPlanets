'use strict';

import {load_shaders} from './engine/shader_global.js';
import {load_models} from './engine/models_global.js';
import {load_textures} from './engine/textures_global.js';
import {render_scene, init_gl_state} from './engine/renderer.js';
import {create_camera} from './engine/camera.js';
import {init_transform, rotate_transform} from './engine/transform.js';

export async function init(gl){
	const [shaders, models, textures] = await Promise.all([
		load_shaders(gl),
		load_models(gl),
		load_textures(gl),
	]);

	init_gl_state(gl); // Initializing gl state out of promise

	return {
		shaders,
		entities: [
			{
				model: models.bunny,
				texture: textures.bricks_texture,
				transform: init_transform([6, 0, -7], [0, 120, 0], [1.5, 1.5, 1.5]),
			},
			{
				model: models.plane,
				texture: textures.bricks_texture,
				normal_map: textures.bricks_normal,
				transform: init_transform([5, 0, -12], [0, 90, 0], [10, 10 , 10]),
			},
		],
		light: {
			position: [-3, 1, -3],
			color: [1, 1, 1],
		},
		camera: create_camera([0, 2, 0], 5, 20, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};
}

export function draw(gl, scene_data){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	render_scene(gl, scene_data);
}
