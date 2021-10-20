'use strict';

import {init, draw} from '/JS/application.js'

let gl;
let sceneData;

async function main(){
	const canvas = document.querySelector('#canvas');
	gl = canvas.getContext('webgl2');
	if(gl == null){
		console.error('Failed to initialize webgl');
		return;
	}
	console.log('WebGL Version: ' + gl.getParameter(gl.VERSION));
	console.log('GLSL Version: ' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

	// Initialization of the mythical super class
	sceneData = await init(gl);
	console.log(sceneData);
	renderScene();
}

function renderScene(){
	draw(sceneData);
	requestAnimationFrame(renderScene);
}

window.onload = main;
