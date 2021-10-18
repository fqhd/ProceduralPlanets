let gl;
let program;

function init(){
	let canvas = document.querySelector('#canvas');
	gl = canvas.getContext('webgl2');
	if(gl == null){
		console.error('Failed to initialize webgl');
		return;
	}
	console.log('WebGL Version: ' + gl.getParameter(gl.VERSION));
	console.log('GLSL Version: ' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

	initglState();
	shader = getShader(gl);
	renderScene();
}

function initglState(){
	gl.clearColor(0, 0, 1, 1);
}

function renderScene(){
	gl.clear(gl.COLOR_BUFFER_BIT);

	requestAnimationFrame(renderScene);
}

window.onload = init;
