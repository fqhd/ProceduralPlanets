'use strict';

import {load_model_from_file} from './model.js';

export async function load_models(gl){
	return {
		bunny: await load_model_from_file(gl, 'res/models/bunny.obj'),
		plane: await load_model_from_file(gl, 'res/models/plane.obj'),
	};
}
