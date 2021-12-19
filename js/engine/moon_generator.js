import {generate_sphere} from './sphere_generator.js';
import {calc_normals} from './normal_generator.js';
import {init_crater_generator, scale_positions} from './crater_generator.js';
import {create_mesh} from './mesh_generator.js';

export function create_moon_model(gl){
	const {positions, indices} = generate_sphere(6);

	const config = get_crater_generation_config();
	init_crater_generator(config);
	scale_positions(positions);

	const normals = calc_normals(positions, indices);
	return create_mesh(gl, positions, normals, indices);
}

function get_crater_generation_config(){
	return {
		floor_height: -0.05,
		rim_height: 0.2,
		rim_width: 0.3,
	};
}