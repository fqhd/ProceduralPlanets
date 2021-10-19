'use strict';

import {createVAO, drawVAO} from 'vao.js';

export async function loadModel(gl, path){
	const response = await fetch(path);
	const blob = await response.blob();

	console.log(blob);
}
