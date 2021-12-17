import { load_image } from './utils.js'


export async function load_skybox(gl){
	return {
		model: init_cube_model(gl),
		texture: await load_cubemap_from_file(gl, 'res/textures/skybox/'),
	};
}

async function load_cubemap_from_file(gl, path_to_file){
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

	for(let i = 0; i < 6; i++){
		const image = await load_image(path_to_file + image_order[i] + '.jpg');
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	}

	return texture;
}

function init_cube_model(gl){
	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	// Creating the positions buffer
	const pos_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pos_buff);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
	const positions = [
		-1, -1, 1,
		-1, 1, 1,
		1, 1, 1,
		1, -1, 1,

		-1, -1, -1,
		-1, 1, -1,
		1, 1, -1,
		1, -1, -1,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	// Creating the indices buffer
	const indices_buff = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buff);
	const indices = [
		0, 1, 2, 0, 2, 3,
		4, 5, 1, 4, 1, 0,
		3, 2, 6, 3, 6, 7,
		1, 5, 6, 1, 6, 2,
		7, 6, 5, 7, 5, 4,
		4, 0, 7, 7, 0, 3,
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

	return {
		vao,
		indices_buff,
		num_indices: indices.length,
	};
}
