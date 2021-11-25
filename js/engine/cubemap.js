export function load_cubemap_from_file(gl, path_to_file){
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	const image_order = [
		'bottom',
		'front',
		'top',
		'back',
		'right',
		'left',
	];

	const temp_data = [255, 255, 255];
	for(let i = 0; i < 6; i++){
		const image = new Image();
		image.onload = function(){
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
			gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
		}
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(temp_data));
		image.src = path_to_file + image_order[i] + '.jpg';
	}

	return texture;
}