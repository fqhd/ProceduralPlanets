'use strict';

import {load_model_from_file} from './model.js';

export async function load_models(gl){
	return {
		bunny: await load_model_from_file(gl, 'res/models/bunny.obj'),
		cube: await load_model_from_file(gl, 'res/models/cube.obj'),
		monkey: await load_model_from_file(gl, 'res/models/monkey.obj'),
	};
}
