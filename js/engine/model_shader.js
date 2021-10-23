'use strict';

import {create_shader} from '/JS/Engine/shader.js'

export async function load_model_shader(gl){
	// This is useful because in the future we are going to add shader uniform locations to the object returned by this function
	const program = await create_shader(gl, 'res/shaders/modelShader/');

	return {
		program,
	};
}