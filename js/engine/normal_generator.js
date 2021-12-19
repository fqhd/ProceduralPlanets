const {vec3} = glMatrix;

export function calc_normals(positions, indices){
	const triangle_map = new Map();

	// Loop and fill hashmap of connected triangles for each vertex
	for(let i = 0; i < indices.length; i+=3){
		const i0 = indices[i];
		const i1 = indices[i+1];
		const i2 = indices[i+2];

		const v0 = vec3.fromValues(positions[i0*3], positions[i0*3+1], positions[i0*3+2]);
		const v1 = vec3.fromValues(positions[i1*3], positions[i1*3+1], positions[i1*3+2]);
		const v2 = vec3.fromValues(positions[i2*3], positions[i2*3+1], positions[i2*3+2]);

		const v0_hash = hash_vector(v0);
		const v1_hash = hash_vector(v1);
		const v2_hash = hash_vector(v2);

		const v0_triangle_array = triangle_map.get(v0_hash);
		const v1_triangle_array = triangle_map.get(v1_hash);
		const v2_triangle_array = triangle_map.get(v2_hash);

		if(!v0_triangle_array){
			triangle_map.set(v0_hash, [i0, i1, i2]);
		}else{
			v0_triangle_array.push(i0, i1, i2);
		}

		if(!v1_triangle_array){
			triangle_map.set(v1_hash, [i0, i1, i2]);
		}else{
			v1_triangle_array.push(i0, i1, i2);
		}

		if(!v2_triangle_array){
			triangle_map.set(v2_hash, [i0, i1, i2]);
		}else{
			v2_triangle_array.push(i0, i1, i2);
		}
	}

	// Loop through positions and calculate normals
	const normals = [];
	for(let i = 0; i < positions.length; i+=3){
		const pos = vec3.fromValues(positions[i], positions[i+1], positions[i+2]);
		const pos_hash = hash_vector(pos);
		const connected_triangle_indices = triangle_map.get(pos_hash);

		const local_normals = [];
		for(let j = 0; j < connected_triangle_indices.length; j+=3){
			const i0 = connected_triangle_indices[j];
			const i1 = connected_triangle_indices[j+1];
			const i2 = connected_triangle_indices[j+2];

			const v0 = vec3.fromValues(positions[i0*3], positions[i0*3+1], positions[i0*3+2]);
			const v1 = vec3.fromValues(positions[i1*3], positions[i1*3+1], positions[i1*3+2]);
			const v2 = vec3.fromValues(positions[i2*3], positions[i2*3+1], positions[i2*3+2]);

			const tri_normal = calc_triangle_normal(v0, v1, v2);

			local_normals.push(tri_normal);
		}

		// Loop through normals and add them all together
		const local_normals_sum = vec3.fromValues(0, 0, 0);
		for(let j = 0; j < local_normals.length; j++){
			vec3.add(local_normals_sum, local_normals_sum, local_normals[j]);
		}
		vec3.normalize(local_normals_sum, local_normals_sum);

		normals.push(local_normals_sum[0], local_normals_sum[1], local_normals_sum[2]);
	}

	return normals;
}

export function calc_triangle_normal(v0, v1, v2){
	const A0 = vec3.create();
	const A1 = vec3.create();

	vec3.sub(A0, v1, v0);
	vec3.sub(A1, v2, v0);

	const normal = vec3.create();

	vec3.cross(normal, A0, A1);
	return normal;
}

function hash_vector(vec){
	return vec.toString();
}