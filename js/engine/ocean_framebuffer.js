export function create_ocean_framebuffer(gl, width, height){
	const textures = [
		create_ocean_albedo_texture(gl, width, height),
		create_ocean_depth_texture(gl, width, height),
	];
	const renderbuffer = create_ocean_renderbuffer(gl, width, height);
	const id = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, id);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures[0].id, 0);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, textures[1].id, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer, 0);
	gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	return {
		id,
		textures,
	};
}

function create_ocean_renderbuffer(gl, width, height){
	const renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	return renderbuffer;
}

function create_ocean_albedo_texture(gl, width, height){
	const id = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, id);
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGB8, width, height);
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

function create_ocean_depth_texture(gl, width, height){
	const id = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, id);
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R16F, width, height);
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