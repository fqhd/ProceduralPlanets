'use strict';

import {loadModelShader} from '/JS/Engine/modelShader.js';
import {loadVAOFromFile} from '/JS/Engine/vao.js'

export async function init(gl){
	const [shader, model] = await Promise.all([
		loadModelShader(gl),
		loadVAOFromFile(gl, 'res/models/triangle.txt'),
	]).then(results => {
		console.log('Successfully resolved promises!');
		return results;
	});

	return {shader, model};
}

export function draw(gl, sceneData){
	
}
