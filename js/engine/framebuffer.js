export function bind_framebuffer(gl, framebuffer) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.id);
	gl.viewport(0, 0, framebuffer.textures[0].width, framebuffer.textures[0].height);
}

export function bind_default_framebuffer(gl){
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
}
