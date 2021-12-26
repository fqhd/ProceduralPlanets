import {generate_sphere} from './sphere_generator.js';
import { generate_craters } from './crater_generator.js';
import { create_moon_mesh } from './mesh_generator.js';
import { scale_positions_with_noise } from './terrain_shaper.js';
import { get_random_point_on_sphere, clamp } from './maths.js';
import { create_sphere_texture } from './texture.js';

export function create_moon(gl){
	const {positions, indices} = generate_sphere(6);

	add_craters_to_sphere(positions);
	scale_positions_with_noise(positions);
	
	return {
		model: create_moon_mesh(gl, positions, indices),
		sphere_texture: create_sphere_texture(gl, positions),
	};
}

function add_craters_to_sphere(positions){
	const craters = create_crater_array();
	generate_craters(positions, craters);
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