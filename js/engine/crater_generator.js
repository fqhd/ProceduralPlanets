const {vec3} = glMatrix;
let rim_height;
let rim_width;
let floor_height;
let rim_a;
let crater_a;

export function init_crater_generator(config){
	rim_height = config.rim_height;
	rim_width = config.rim_width;
	floor_height = config.floor_height;
	const edge = rim_width * 0.2;
	crater_a = calc_a(rim_height, -0.3, rim_width - edge);
	rim_a = calc_a(rim_height, 0, rim_width - edge);
}

export function scale_positions(positions){
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

function red_func(x){
	return crater_a * Math.pow(x, 2) - 0.3;
}

function purple_func(x){
	return rim_a * Math.pow(x - rim_width, 2);
}

function orange_func(x){
	return rim_a * Math.pow(x + rim_width, 2);
}

function green_func(){
	return floor_height;
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

function crater_shape(x){
	const r = red_func(x);
	const p = purple_func(x);
	const o = orange_func(x);
	const g = green_func(x);

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
	const crater_pos = vec3.create();
	crater_pos[0] = 0;
	crater_pos[1] = 0;
	crater_pos[2] = 1;

	const x = calc_length_between_two_points_on_sphere(crater_pos, pos);

	const base_height = 1;
	let height = 0;

	if(x < rim_width){ // If point is inside the crater
		height = crater_shape(x);
	}

	// return 5 + noise.perlin3(vec[0] * 2, vec[1] * 2, vec[2] * 2) + noise.perlin3(vec[0] * 5, vec[1] * 5, vec[2] * 5) * 0.5;
	// return 1 + Math.sin(pos[1] * 20) * 0.05;
	return base_height + height;
}
