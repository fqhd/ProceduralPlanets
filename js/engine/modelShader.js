'use strict';

import {createShader} from '/JS/Engine/shader.js'

export async function loadModelShader(gl){
	// This is useful because in the future we are going to add shader uniform locations to the object returned by this function
	const program = await createShader(gl, 'res/shaders/modelShader/');

	return {
		program,
	};
}