import {generate_sphere} from './sphere_generator.js';
import {calc_normals} from './normal_generator.js';
import {init_crater_generator, generate_craters} from './crater_generator.js';
import {create_mesh} from './mesh_generator.js';
import { get_random_point_on_sphere } from './utils.js';
const {vec3} = glMatrix;

export function create_moon_model(gl){
	const {positions, indices} = generate_sphere(7);

	const craters = get_crater_generation_config();
	init_crater_generator(craters);
	generate_craters(positions);

	const normals = calc_normals(positions, indices);
	return create_mesh(gl, positions, normals, indices);
}

function get_crater_generation_config(){
	// return [
	// 	{
	// 		position: vec3.fromValues(0, 0, 1),
	// 		floor_height: -0.1,
	// 		rim_height: 0.2,
	// 		rim_width: 0.5,
	// 	}
	// ];
	const craters = [];
	for(let i = 0; i < 10; i++){
		craters.push({
			position: get_random_point_on_sphere(),
			floor_height: -0.1,
			rim_height: 0.2,
			rim_width: 0.15 + Math.random() * 0.3,
		});
	}
	return craters;
}