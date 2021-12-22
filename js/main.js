import {init_application, draw, update} from './application.js'

let gl;
let scene;

async function main(){
	const canvas = document.getElementById('canvas');
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	
	gl = canvas.getContext('webgl2');

	if(gl == null){
		console.error('Failed to initialize webgl');
		return;
	}
	console.log('WebGL Version: ' + gl.getParameter(gl.VERSION));
	console.log('GLSL Version: ' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

	// Initialization of the mythical super data structure
	scene = await init_application(gl);
	draw_game();
}

function draw_game(){
	update(scene);
	draw(gl, scene);
	requestAnimationFrame(draw_game);
}

window.onload = main;
