import { load_image, get_resolution_from_num, fill_arr_to_length } from './utils.js';

export function load_texture_from_data(gl, data){
	const our_arr = [...data];
	const {width, height} = get_resolution_from_num(our_arr.length/3);
	fill_arr_to_length(our_arr, width*height*3);

	console.log(`positions texture: ${width}x${height}`);

	const id = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, id);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB32F, width, height, 0, gl.RGB, gl.FLOAT, new Float32Array(our_arr));
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	return {
		width,
		height,
		id,
	}
}

export function create_indices_texture(gl, indices){
	const our_arr = [...indices];
	const {width, height} = get_resolution_from_num(our_arr.length);
	fill_arr_to_length(our_arr, width*height*3);

	console.log(`indices texture: ${width}x${height}`);

	const id = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, id);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32I, width, height, 0, gl.RED_INTEGER, gl.INT, new Int32Array(our_arr));
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	return {
		width,
		height,
		id,
	}
}

export async function load_texture_from_file(gl, path_to_file){
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	const image = await load_image(path_to_file);

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

	gl.generateMipmap(gl.TEXTURE_2D);
	const ext = gl.getExtension('EXT_texture_filter_anisotropic');
	if(ext != null){
		const amount = Math.min(4, gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
		gl.texParameteri(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, amount);
	}else{
		console.log('Browser does not support anisotropic filtering extension');
	}

	return texture;
}
