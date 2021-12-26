import { load_image, get_resolution_from_num } from './utils.js';

export async function load_textures(gl){
	return {
		normal_map: await load_texture_from_file(gl, 'res/textures/normal_map.jpg'),
	};
}

export function create_sphere_texture(gl, data){
	const {width, height} = get_resolution_from_num(data.length/3);

	const max_texture_size = gl.getParameter(gl.MAX_TEXTURE_SIZE);
	console.log('MAX TEXTURE SIZE: ' + max_texture_size);

	console.log({width, height});

	const id = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, id);

	gl.bindTexture(gl.TEXTURE_2D, id);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB32F, width, height, 0, gl.RGB, gl.FLOAT, new Float32Array(data));
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

async function load_texture_from_file(gl, path_to_file){
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
