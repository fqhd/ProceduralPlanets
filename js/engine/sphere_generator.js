// Icosphere generation inspired by Andreas Kahler
const {vec3} = glMatrix;

export function generate_sphere(subdivision_level){
	const positions = get_icosahedron_vertices();
	const indices = get_icosahedron_indices();
	const positions_map = new Map();

	// Subdivide icosahedron triangles
	for(let i = 0; i < subdivision_level; i++){
		const num_indices = indices.length;
		for(let j = 0; j < num_indices; j+=3){
			subdivide_triangle(positions, positions_map, indices, j+0, j+1, j+2);
		}
	}

	normalize_positions(positions);
	return { positions, indices };
}

function normalize_positions(positions){
	for(let i = 0; i < positions.length; i+=3){
		const l = vec3.create();
		vec3.normalize(l, vec3.fromValues(positions[i], positions[i+1], positions[i+2]));
		positions[i] = l[0];
		positions[i+1] = l[1];
		positions[i+2] = l[2];
	}
}

function get_middle_point(positions, positions_map, v0, v1){
	const x = (positions[v0 * 3] + positions[v1 * 3]) / 2;
	const y = (positions[v0 * 3 + 1] + positions[v1 * 3 + 1]) / 2;
	const z = (positions[v0 * 3 + 2] + positions[v1 * 3 + 2]) / 2;
	const midpoint = vec3.fromValues(x, y, z);
	const midpoint_hash = hash_vector(midpoint);
	let index = positions_map.get(midpoint_hash);
	if(!index){
		positions.push(midpoint[0]);
		positions.push(midpoint[1]);
		positions.push(midpoint[2]);
		index = positions.length/3 - 1;
		positions_map.set(midpoint_hash, index);
	}
	return index;
}

function hash_vector(vec){
	return vec.toString();
}

function subdivide_triangle(positions, positions_map, indices, a, b, c){
	const d = get_middle_point(positions, positions_map, indices[c], indices[a]);
	const e = get_middle_point(positions, positions_map, indices[a], indices[b]);
	const f = get_middle_point(positions, positions_map, indices[b], indices[c]);

	indices.push(d, e, f);
	indices.push(e, indices[b], f);
	indices.push(d, f, indices[c]);
	
	indices[c] = indices[a];
	indices[b] = d;
	indices[a] = e;
}

function get_icosahedron_vertices(){
	const t = (1 + Math.sqrt(5)) / 2;

	const positions = [
		-1,  t,  0,
		1,  t,  0,
		-1, -t,  0,
		1, -t,  0,

		0, -1,  t,
		0,  1,  t,
		0, -1, -t,
		0,  1, -t,

		t,  0, -1,
		t,  0,  1,
		-t,  0, -1,
		-t,  0,  1,
	];

	return positions;
}

function get_icosahedron_indices(){
	const indices = [
		0, 11, 5,
		0, 5, 1,
		0, 1, 7,
		0, 7, 10,
		0, 10, 11,

		1, 5, 9,
		5, 11, 4,
		11, 10, 2,
		10, 7, 6,
		7, 1, 8,

		3, 9, 4,
		3, 4, 2,
		3, 2, 6,
		3, 6, 8,
		3, 8, 9,

		4, 9, 5,
		2, 4, 11,
		6, 2, 10,
		8, 6, 7,
		9, 8, 1,
	];

	return indices;
}

export function get_neighbouring_indices_array(indices, num_positions){
	const indices_map = new Map();
	for(let i = 0; i < indices.length; i+=3){
		const a = indices[i];
		const b = indices[i+1];
		const c = indices[i+2];

		add_neighbouring_indices(indices_map, a, b, c);
		add_neighbouring_indices(indices_map, b, c, a);
		add_neighbouring_indices(indices_map, c, a, b);
	}

	const arr = [];
	for(let i = 0; i < num_positions; i++){
		arr.push(...indices_map.get(i));
	}

	return arr;
}

function add_neighbouring_indices(indices_map, a, b, c){
	const index = indices_map.get(a);
	if(index){
		if(index.length < 10){
			index.push(b, c);
		}
	}else{
		indices_map.set(a, [b, c]);
	}
}