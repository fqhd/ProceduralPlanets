'use strict';

import {loadModelShader} from '/JS/Engine/ModelShader.js';
import {loadModelFromFile} from '/JS/Engine/model.js';
import {renderScene, initGLState} from '/JS/Engine/renderer.js';

export async function init(gl){
	const [shader, triangle] = await Promise.all([
		loadModelShader(gl),
		loadModelFromFile(gl, 'res/models/triangle.txt'),
		initGLState(gl),
	]).then(results => {
		console.log('Successfully resolved promises!');
		return results;
	});

	return {
		shader,
		entity: {
			model: triangle,
			position: [0, 0, -6],
		},
	};
}

export function draw(gl, sceneData){
	gl.clear(gl.COLOR_BUFFER_BIT);

	renderScene(gl, sceneData);
}
