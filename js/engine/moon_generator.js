import {generate_sphere} from './sphere_generator.js';
import {calc_normals} from './normal_generator.js';
import {prepare_craters, generate_craters} from './crater_generator.js';
import { create_moon_mesh } from './mesh_generator.js';
import { scale_positions_with_noise, get_noise } from './terrain_shaper.js';
import { get_random_point_on_sphere } from './utils.js';

const { vec3 } = glMatrix;

export function create_moon_model(gl){
	const {positions, indices} = generate_sphere(6);

	const craters = creat_crater_array();
	prepare_craters(craters);
	generate_craters(positions);
	scale_positions_with_noise(positions);
	const normals = calc_normals(positions, indices);
	const mix_factors = create_mix_factors(positions);
	
	return create_moon_mesh(gl, positions, normals, mix_factors, indices);
}

function exponentialize(x){
	return Math.pow(x, 4);
}

function create_mix_factors(positions){
	const arr = [];
	for(let i = 0; i < positions.length; i+=3){
		const pos = vec3.fromValues(positions[i], positions[i+1], positions[i+2]);
		const mix_factor = (get_noise(pos, noise.perlin3, 5) + 1) / 2;
		arr.push(mix_factor);
	}
	return arr;
}

function creat_crater_array(){
	const craters = [];
	for(let i = 0; i < 10; i++){
		const crater_width = 0.2 + exponentialize(Math.random()) * 0.2;
		const rim_height = crater_width * 0.2;
		craters.push({
			position: get_random_point_on_sphere(),
			crater_width,
			rim_height,
		});
	}
	return craters;
}