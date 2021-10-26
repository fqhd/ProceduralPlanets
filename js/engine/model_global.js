'use strict';

import {load_model_from_file} from '/js/engine/model.js';

export async function load_models(gl){
	return {
		bunny: await load_model_from_file(gl, 'res/models/normal_bunny.obj'),
		cube: await load_model_from_file(gl, 'res/models/cube.obj'),
	};
}
