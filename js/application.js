'use strict';

import {load_model_shader} from '/js/engine/shader_global.js';
import {load_model_from_file} from '/js/engine/model.js';
import {render_scene, init_gl_state} from '/js/engine/renderer.js';

export async function init(gl){
	const [shader, triangle] = await Promise.all([
		load_model_shader(gl),
		load_model_from_file(gl, 'res/models/triangle.txt'),
		init_gl_state(gl),
	]);

	return {
		shader,
		entity: {
			model: triangle,
			position: [0, 1, 0],
		},
	};
}

export function draw(gl, scene_data){
	gl.clear(gl.COLOR_BUFFER_BIT);

	render_scene(gl, scene_data);
}
