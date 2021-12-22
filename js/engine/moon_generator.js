import {generate_sphere} from './sphere_generator.js';
import {calc_normals} from './normal_generator.js';
import {prepare_craters, generate_craters} from './crater_generator.js';
import { create_moon_mesh } from './mesh_generator.js';
import { scale_positions_with_noise, get_noise } from './terrain_shaper.js';
import { get_random_point_on_sphere, clamp, sigmoid } from './utils.js';

const { vec3 } = glMatrix;

export function create_moon_model(gl){
	const {positions, indices} = generate_sphere(6);

	const craters = create_crater_array();
	prepare_craters(craters);
	generate_craters(positions);
	scale_positions_with_noise(positions);
	const normals = calc_normals(positions, indices);
	const nmap_mix_factors = create_mix_factors(positions, 5);
	const color_mix_factors = create_mix_factors(positions, 2);
	sigmoid_mix_factors(color_mix_factors, 30);
	
	return create_moon_mesh(gl, positions, normals, nmap_mix_factors, color_mix_factors, indices);
}

function exponentialize(x){
	return Math.pow(x, 6);
}

function create_mix_factors(positions, freq){
	const arr = [];
	for(let i = 0; i < positions.length; i+=3){
		const pos = vec3.fromValues(positions[i], positions[i+1], positions[i+2]);
		const mix_factor = (get_noise(pos, noise.perlin3, freq) + 1) / 2;
		arr.push(mix_factor);
	}
	return arr;
}

function sigmoid_mix_factors(factors, scale){
	for(let i = 0; i < factors.length; i++){
		factors[i] = sigmoid(factors[i], scale);
	}
}

function create_crater_array(){
	const craters = [];
	for(let i = 0; i < 100; i++){
		const crater_width = 0.05 + exponentialize(Math.random()) * 0.3;
		const rim_height = clamp(crater_width * 0.2, 0.025, 0.2);
		const position = get_random_point_on_sphere();
		craters.push({
			position,
			crater_width,
			rim_height,
		});
	}
	return craters;
}