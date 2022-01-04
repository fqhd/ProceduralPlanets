export function create_planet_framebuffer(gl, width, height){
	const textures = [
		create_framebuffer_texture(gl, width, height),
	];
	const id = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, id);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures[0].id, 0);
	gl.bindFramebuffer(gl.FRAMEBUFFER,  null);
	return {
		id,
		textures,
	};
}

function create_framebuffer_texture(gl, width, height){
	const id = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, id);
	if(!gl.getExtension('EXT_color_buffer_float')){
		console.error('Does not support color buffer rendering extension :(');
	}
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, width, height);
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