'use strict';

import {init, draw} from './application.js'

let gl;
let scene_data;

async function main(){
	const canvas = document.getElementById('canvas');

	gl = canvas.getContext('webgl2');

	if(gl == null){
		console.error('Failed to initialize webgl');
		return;
	}
	console.log('WebGL Version: ' + gl.getParameter(gl.VERSION));
	console.log('GLSL Version: ' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

	// Initialization of the mythical super data structure
	scene_data = await init(gl);
	draw_game();
}

function draw_game(){
	draw(gl, scene_data);
	requestAnimationFrame(draw_game);
}

window.onload = main;
