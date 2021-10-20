'use strict';

import {createShader} from '/JS/Engine/shader.js';
import {loadVAOFromFile} from '/JS/Engine/vao.js'

export async function init(gl){
	const [shader, model] = await Promise.all([
		createShader(gl, 'res/shaders/modelShader/'),
		loadVAOFromFile(gl, 'res/models/triangle.txt'),
	]).then(results => {
		console.log('Successfully resolved promises!');
		return results;
	});

	return {shader, model};
}

export function draw(gl, sceneData){
	
}
