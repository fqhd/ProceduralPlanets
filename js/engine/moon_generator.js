import {generate_sphere} from './sphere_generator.js';
import {calc_normals} from './normal_generator.js';
import { generate_craters } from './crater_generator.js';
import { create_moon_mesh } from './mesh_generator.js';
import { scale_positions_with_noise } from './terrain_shaper.js';
import { get_noise, get_warped_noise } from './utils.js';
import { get_random_point_on_sphere, sigmoid, clamp } from './maths.js';

const { vec3 } = glMatrix;

export function create_moon_model(gl){
	const {positions, indices} = generate_sphere(7);

	add_craters_to_sphere(positions);
	scale_positions_with_noise(positions);
	const normals = calc_normals(positions, indices);
	const color_mix_factors = create_color_mix_factors(positions);
	
	return create_moon_mesh(gl, positions, normals, color_mix_factors, indices);
}

function add_craters_to_sphere(positions){
	const craters = create_crater_array();
	generate_craters(positions, craters);
}

function create_color_mix_factors(positions){
	const freq = Math.random();
	let mix_factors = create_warped_mix_values(positions, freq);
	mix_factors = mix_factors.map(e => Math.pow(e, 1));
	const sharpness = Math.random() * 100;
	mix_factors = mix_factors.map(e => sigmoid(e, sharpness));
	return mix_factors;
}

function create_warped_mix_values(positions, freq){
	const arr = [];
	for(let i = 0; i < positions.length; i+=3){
		const pos = vec3.fromValues(positions[i], positions[i+1], positions[i+2]);
		const mix_factor = (get_warped_noise(pos, freq) + 1) / 2;
		arr.push(mix_factor);
	}
	return arr;
}

const MIN_CRATER_WIDTH = 0.2;
const MAX_CRATER_WIDTH = 0.4;

function create_crater_array(){
	const craters = [];
	for(let i = 0; i < 30; i++){
		const crater_width = MIN_CRATER_WIDTH + Math.pow(Math.random(), 6) * (MAX_CRATER_WIDTH - MIN_CRATER_WIDTH);
		craters.push({
			crater_width,
			position: get_random_point_on_sphere(),
			rim_height: clamp(crater_width * 0.2, 0.025, 0.2),
			floor_height: -0.03 + ((crater_width * Math.random()) / MAX_CRATER_WIDTH) * -0.15,
		});
	}
	return craters;
}