let gl = null;

function init(){
	let canvas = document.querySelector('#canvas');
	gl = canvas.getContext('webgl2');
	if(gl === null){
		console.error('Failed to initialize webgl');
		return;
	}

	initglState();
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
