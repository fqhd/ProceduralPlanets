'use strict';

export async function load_textured_models(gl){
	return {
		plane: await load_textured_model(gl, '/res/models/textured_models/plane.obj'),
	};
}

export async function load_raw_models(gl){
	return {
		bunny: await load_raw_model(gl, '/res/models/raw_models/bunny.obj'),
	};
}

async function load_raw_model(gl, path){
    const response = await fetch(path);
    const text = await response.text();
    const lines = text.split('\n');

    const positions = [];
    const normals = [];
    const indices = [];

    for(let i = 0; i < lines.length; i++){
        const tokens = lines[i].split(' ');
        switch(tokens[0]){
            case 'v':
                positions.push(tokens[1]);
                positions.push(tokens[2]);
                positions.push(tokens[3]);
            break;
            case 'vn':
                normals.push(tokens[1]);
                normals.push(tokens[2]);
                normals.push(tokens[3]);
            break;
            case 'f':
				// We subtract one from the indices because blender starts counting from 1 instead of 0(like opengl expects)
                indices.push(tokens[1]-1);
                indices.push(tokens[2]-1);
                indices.push(tokens[3]-1);
            break;
        }
    }

	return create_raw_model(gl, positions, normals, indices);
}

async function load_textured_model(gl, path){
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

	const tangents = calc_tangents(positions, uvs);

	return create_textured_model(gl, positions, normals, tangents, uvs);
}

function sub_vec2(a, b){
	return [a[0] - b[0], a[1] - b[1]];
}

function sub_vec3(a, b){
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function mul_vec3(a, b){
	return [a[0] * b, a[1] * b, a[2] * b];
}

function calc_tangents(positions, uvs){
	const tangents = [];

	let j = 0;

	for(let i = 0; i < positions.length; i+=9){
		const P1 = [positions[i], positions[i+1], positions[i+2]];
		const P0 = [positions[i+3], positions[i+4], positions[i+5]];
		const P2 = [positions[i+6], positions[i+7], positions[i+8]];

		const T1 = [uvs[j], uvs[j+1]];
		const T0 = [uvs[j+2], uvs[j+3]];
		const T2 = [uvs[j+4], uvs[j+5]];
		j+=6;
		
		const delta_pos_1 = sub_vec3(P1, P0);
		const delta_pos_2 = sub_vec3(P2, P0);

		const delta_uv_1 = sub_vec2(T1, T0);
		const delta_uv_2 = sub_vec2(T2, T0);

		const r = 1 / (delta_uv_1[0] * delta_uv_2[1] - delta_uv_1[1] * delta_uv_2[0]);

		const tangent = mul_vec3(sub_vec3(mul_vec3(delta_pos_1, delta_uv_2[1]), mul_vec3(delta_pos_2, delta_uv_1[1])), r);

		tangents.push(tangent[0]);
		tangents.push(tangent[1]);
		tangents.push(tangent[2]);
		tangents.push(tangent[0]);
		tangents.push(tangent[1]);
		tangents.push(tangent[2]);
		tangents.push(tangent[0]);
		tangents.push(tangent[1]);
		tangents.push(tangent[2]);
	}

	return tangents;
}

function create_raw_model(gl, positions, normals, indices){
	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	const pos_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pos_buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(0);

	const normal_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normal_buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(1);

	const indices_buff = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buff);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	return {
		vao,
		indices_buff,
		num_indices: indices.length,
	};
}

function create_textured_model(gl, positions, normals, tangents, tex_coords){
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

	const tangent_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tangent_buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(2);
	gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

	const uv_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, uv_buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(3);
	gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 0, 0);

	return {
		vao,
		num_vertices: positions.length/3,
	};
}
