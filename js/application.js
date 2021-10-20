'use strict';

import {createShader} from '/JS/Engine/shader.js';
import {createModel} from '/JS/Engine/model.js'

export async function init(gl){
	const [shader, model] = await Promise.all([
		createShader(gl, 'res/shaders/vs.glsl', 'res/shaders/fs.glsl'),
		createModel(gl, 'res/models/triangle.txt'),
	]).then(results => {
		console.log('Successfully resolved promises!');
		return results;
	});

	return {shader, model};
}

export function draw(sceneData){

}
