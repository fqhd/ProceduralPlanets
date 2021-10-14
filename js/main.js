function main(){
	// Querying the canvas from the DOM
	const canvas = document.getElementById('canvas');

	// Creating webgl context
	const gl = canvas.getContext('webgl');

	// Error checking(exiting if the context creation failed)
	if(gl === null){
		alert('Failed to initialize webgl. Your browser may not support it.');
		return;
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);


	const fsSource = "void main(){gl_FragColor = vec4(1, 0, 0, 1);}";

	loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
}

function loadShader(gl, type, source){
	// Creating the shader object
	const shader = gl.createShader(type);

	// Sending the source to the shader object
	gl.shaderSource(shader, source);

	// Compiling the shader
	gl.compileShader(shader);

	// Checking if the shader has been compiled properly
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		alert('Failed to compile shader!');
		return null;
	}

	return shader;
}

window.onload = main;
