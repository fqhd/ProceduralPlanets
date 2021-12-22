import { smax, smin } from './maths.js';

const { vec3 } = glMatrix;

export function generate_craters(positions, craters){
	setup_craters(craters);
	for(let i = 0; i < positions.length; i+=3){
		const pos = vec3.fromValues(positions[i], positions[i+1], positions[i+2]);
		const height = get_height_from_pos(pos, craters);
		vec3.scale(pos, pos, height);
		positions[i] = pos[0];
		positions[i+1] = pos[1];
		positions[i+2] = pos[2];
	}
}

function setup_craters(craters) {
	for(const i of craters) {
		const edge = i.crater_width * 0.6;
		i.crater_a = calc_crater_a(i.rim_height, -0.3, i.crater_width - edge);
		i.rim_a = calc_rim_a(i.rim_height, i.crater_width, i.crater_width - edge);
	}
}

function calc_crater_a(y, c, x){
	return (y - c) / Math.pow(x, 2);
}

function calc_rim_a(y, crater_width, x){
	return y / Math.pow(x - crater_width, 2);
}

function red_func(crater_a, x){
	return crater_a * Math.pow(x, 2) - 0.3;
}

function purple_func(rim_a, crater_width, x){
	return rim_a * Math.pow(x - crater_width, 2);
}

function orange_func(rim_a, crater_width, x){
	return rim_a * Math.pow(x + crater_width, 2);
}

function crater_shape(crater, x){
	const r = red_func(crater.crater_a, x);
	const p = purple_func(crater.rim_a, crater.crater_width, x);
	const o = orange_func(crater.rim_a, crater.crater_width, x);
	const g = crater.floor_height;

	let height = r;
	height = smin(height, p, 0.2);
	height = smin(height, o, 0.2);
	height = Math.max(height, g);
	return height;
}

function calc_theta_between_two_points(A, B){
	const C = vec3.create();

	const CA = vec3.create();
	vec3.sub(CA, A, C);

	const CB = vec3.create();
	vec3.sub(CB, B, C);

	const dot_product = vec3.dot(CA, CB);

	return Math.acos(dot_product);
}

function calc_length_between_two_points_on_sphere(A, B){
	const theta = calc_theta_between_two_points(A, B);
	return theta;
}

function get_height_from_pos(pos, craters){
	const base_height = 1;
	let total_height = 0;
	let num_craters = 0;

	for(const i of craters){
		const x = calc_length_between_two_points_on_sphere(i.position, pos);

		if(x < i.crater_width){ // If point is inside the crater
			const height = crater_shape(i, x);
			total_height += height;
			num_craters++;
		}
	}

	if(num_craters){
		total_height /= num_craters;
	}

	return base_height + total_height;
}
