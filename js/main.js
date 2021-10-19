'use strict';

import Application from 'application.js'

let gl;

function init(){
	let canvas = document.querySelector('#canvas');
	gl = canvas.getContext('webgl2');
	if(gl == null){
		console.error('Failed to initialize webgl');
		return;
	}
	console.log('WebGL Version: ' + gl.getParameter(gl.VERSION));
	console.log('GLSL Version: ' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

	// Initialization of the mythical super class
	renderScene();
}

function renderScene(){

	// update mythical render class
	// render mythical render class

	requestAnimationFrame(renderScene);
}

window.onload = init;
