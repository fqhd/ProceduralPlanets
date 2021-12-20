const {vec3} = glMatrix;
let craters;

export function init_crater_generator(c){
	craters = c;
	setup_craters();
}

function setup_craters(){
	for(const i of craters){
		const edge = i.rim_width * 0.2;
		i.crater_a = calc_a(i.rim_height, -0.3, i.rim_width - edge);
		i.rim_a = calc_a(i.rim_height, 0, i.rim_width - edge);
	}
}

export function generate_craters(positions){
	for(let i = 0; i < positions.length; i+=3){
		const pos = vec3.fromValues(positions[i], positions[i+1], positions[i+2]);
		const height = get_height_from_pos(pos);
		vec3.scale(pos, pos, height);
		positions[i] = pos[0];
		positions[i+1] = pos[1];
		positions[i+2] = pos[2];
	}
}

function calc_a(y, c, x){
	return (y - c) / Math.pow(x, 2);
}

function red_func(crater_a, x){
	return crater_a * Math.pow(x, 2) - 0.3;
}

function purple_func(rim_a, rim_width, x){
	return rim_a * Math.pow(x - rim_width, 2);
}

function orange_func(rim_a, rim_width, x){
	return rim_a * Math.pow(x + rim_width, 2);
}

function clamp(v, a, b){
	if(v < a){
		return a;
	}else if(v > b){
		return b;
	}
	return v;
}

function lerp(a, b, k) {
	return a + (b - a) * k;
}

// Based on: https://www.iquilezles.org/www/articles/smin/smin.htm
function smin(a, b, k){
    const h = clamp(0.5 + 0.5 * (b - a) / k, 0, 1);
    return lerp(b, a, h) - k * h * (1 - h);
}

// Based on: https://en.wikipedia.org/wiki/Smooth_maximum
function smax(a, b, k){
	return ((a + b) + Math.sqrt(Math.pow(a - b, 2) + k)) / 2;
}

function crater_shape(crater, x){
	const r = red_func(crater.crater_a, x);
	const p = purple_func(crater.rim_a, crater.rim_width, x);
	const o = orange_func(crater.rim_a, crater.rim_width, x);
	const g = crater.floor_height;

	let height = r;
	height = smax(r, g, 0.008);
	height = smin(height, p, 0.2);
	height = smin(height, o, 0.2);
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

function get_height_from_pos(pos){
	const base_height = 1;
	let total_height = 0;

	for(const i of craters){
		const base_height = 1;
		const x = calc_length_between_two_points_on_sphere(i.position, pos);

		if(x < i.rim_width){ // If point is inside the crater
			const height = crater_shape(i, x);
			total_height += height;
		}
	}

	return base_height + total_height;
}
