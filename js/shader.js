function initShader(gl, vsource, fsource){
	const program = gl.createProgram();
	const vs = loadShader(gl, gl.VERTEX_SHADER, vsource);
	const fs = loadShader(gl, gl.FRAGMENT_SHADER, fsource);
	return {
		program,
	};
}

function loadShader(gl, type, source){
	const vs = gl.createShader(type);
	gl.shaderSource(vs, source);
	gl.compileShader(vs);
	if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
		if(type == gl.VERTEX_SHADER){
			console.log('Failed to compile vertex shader');
		}else{
			console.log('Failed to compile fragment shader');
		}
	}
	return vs;
}
