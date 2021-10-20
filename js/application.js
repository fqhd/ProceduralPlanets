'use strict';

import {loadModelShader} from '/JS/Engine/modelShader.js';
import {loadModelFromFile, drawModel} from '/JS/Engine/vao.js'

export async function init(gl){
	const [shader, model] = await Promise.all([
		loadModelShader(gl),
		loadModelFromFile(gl, 'res/models/triangle.txt'),
		initGLState(gl),
	]).then(results => {
		console.log('Successfully resolved promises!');
		return results;
	});


	
	return {shader, model};
}

export function draw(gl, sceneData){
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(sceneData.shader.program);
	drawModel(gl, sceneData.model);
}

async function initGLState(gl){
	gl.clearColor(0, 0, 0, 1);
}