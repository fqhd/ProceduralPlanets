import {generate_sphere} from './sphere_generator.js';
import {calc_normals} from './normal_generator.js';
import {init_crater_generator, generate_craters} from './crater_generator.js';
import {create_mesh} from './mesh_generator.js';
import { scale_positions_with_noise } from './terrain_shaper.js';
import { get_random_point_on_sphere } from './utils.js';

export function create_moon_model(gl){
	const {positions, indices} = generate_sphere(6);

	const craters = get_crater_generation_config();
	init_crater_generator(craters);
	generate_craters(positions);
	scale_positions_with_noise(positions);

	const normals = calc_normals(positions, indices);
	return create_mesh(gl, positions, normals, indices);
}

function exponentialize(x){
	return Math.pow(x, 4);
}

function get_crater_generation_config(){
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