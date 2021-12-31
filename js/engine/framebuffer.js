export function create_framebuffer(gl, width, height){
	const texture = create_framebuffer_texture(gl, width, height);
	const id = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, id);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.id, 0);
	gl.bindFramebuffer(gl.FRAMEBUFFER,  null);
	return {
		id,
		texture,
	};
}

export function bind_framebuffer(gl, framebuffer){
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.id);
	gl.viewport(0, 0, framebuffer.texture.width, framebuffer.texture.height);
}

export function bind_default_framebuffer(gl){
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
}

function create_framebuffer_texture(gl, width, height){
	const id = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, id);
	if(!gl.getExtension('EXT_color_buffer_float')){
		console.error('Does not support color buffer rendering extension :(');
	}
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RG32F, width, height);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	return {
		id,
		width,
		height,
	};
}