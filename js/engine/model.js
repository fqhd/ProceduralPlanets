'use strict';

const {vec3} = glMatrix;

export async function load_model_from_file(gl, path){
	const response = await fetch(path);
	const text = await response.text();
	const lines = text.split('\n');
	const positions_lookup = [];
	const normals_lookup = [];
	const uvs_lookup = [];
	for(let i = 0; i < lines.length; i++){
		let tokens = lines[i].split(' ');
		switch(tokens[0]){
			case 'v':
				positions_lookup.push(parseFloat(tokens[1]));
				positions_lookup.push(parseFloat(tokens[2]));
				positions_lookup.push(parseFloat(tokens[3]));
			break;
			case 'vn':
				normals_lookup.push(parseFloat(tokens[1]));
				normals_lookup.push(parseFloat(tokens[2]));
				normals_lookup.push(parseFloat(tokens[3]));
			break;
			case 'vt':
				uvs_lookup.push(parseFloat(tokens[1]));
				uvs_lookup.push(parseFloat(tokens[2]));
			break;
		}
	}

	const positions = [];
	const normals = [];
	const uvs = [];

	for(let i = 0; i < lines.length; i++){
		let tokens = lines[i].split(' ');
		if(tokens[0] == 'f'){
			for(let j = 1; j < 4; j++){
				const curr_token_indices = tokens[j].split('/').map(t => parseInt(t));

				const pos_index = curr_token_indices[0]-1;
				positions.push(positions_lookup[pos_index*3]);
				positions.push(positions_lookup[pos_index*3+1]);
				positions.push(positions_lookup[pos_index*3+2]);

				const uv_index = curr_token_indices[1]-1;
				uvs.push(uvs_lookup[uv_index*2]);
				uvs.push(uvs_lookup[uv_index*2+1]);

				const normal_index = curr_token_indices[2]-1;
				normals.push(normals_lookup[normal_index*3]);
				normals.push(normals_lookup[normal_index*3+1]);
				normals.push(normals_lookup[normal_index*3+2]);
			}
		}
	}

	const model = create_model(gl, positions, normals, uvs);
	calc_tangents(model);
	return model;
}

function calc_tangents(model){
	
}

export function create_model(gl, positions, normals, tex_coords){
	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	const pos_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pos_buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

	const normal_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normal_buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

	const uv_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, uv_buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(2);
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);

	return {
		vao,
		num_vertices: positions.length/3,
	};
}
