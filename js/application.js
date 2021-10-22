'use strict';

const {mat4} = glMatrix;

import {loadModelShader} from '/JS/Engine/modelShader.js';
import {loadModelFromFile, drawModel} from '/JS/Engine/model.js';
import {drawEntity} from '/JS/Engine/renderer.js'; // TODO: Create and import renderScene() in renderer.js

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
			triangle,
			position: [0, 0, -6],
		},
	};
}

export function draw(gl, sceneData){
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(sceneData.shader.program); // TODO: Stop calling this.
	drawModel(gl, sceneData.model); // TODO: Stop calling this. Call renderScene() instead
}

async function initGLState(gl){
	gl.clearColor(0, 0, 0, 1);
	gl.frontFace(gl.CW);
	gl.disable(gl.CULL_FACE);
}