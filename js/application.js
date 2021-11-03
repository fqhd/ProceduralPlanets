'use strict';

import {load_shaders} from '/js/engine/shader_global.js';
import {load_models} from '/js/engine/models_global.js';
import {load_textures} from '/js/engine/textures_global.js';
import {render_scene, init_gl_state} from '/js/engine/renderer.js';
import {create_camera} from '/js/engine/camera.js';
import {init_transform, translate_transform, rotate_transform} from '/js/engine/transform.js';

export async function init(gl){
	const [shaders, models, textures] = await Promise.all([
		load_shaders(gl),
		load_models(gl),
		load_textures(gl),
	]);

	init_gl_state(gl);

	return {
		shaders,
		entities: [
			{
				model: models.bunny,
				texture: textures.bricks,
				transform: init_transform([-2, 0, -10], [35, 0, 0], [1, 1, 1]),
			},
			{
				model: models.monkey,
				texture: textures.bricks,
				transform: init_transform([2, 0, -10], [35, 0, 0], [1, 1 ,1]),
			},
		],
		camera: create_camera([0, 0, 0], 0, 0, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};
}

export function draw(gl, scene_data){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	rotate_transform(scene_data.entities[0].transform, [0, -0.3, 0]);
	rotate_transform(scene_data.entities[1].transform, [0, 0.3, 0]);

	render_scene(gl, scene_data);
}
