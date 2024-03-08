import { init_application, draw, create_scene } from './application.js'
import { download_image } from './engine/utils.js';

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
	await init_application(gl);
	scene = create_scene(gl);
	draw_game();
}

function draw_game(time){
	draw(gl, scene, time);
	// download_image();
	requestAnimationFrame(draw_game);
}

window.onload = main;
