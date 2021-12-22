const {vec3} = glMatrix;

export function deg_to_rad(degrees) {
	return degrees * (Math.PI / 180);
};

export function rad_to_deg(rad) {
	return rad / (Math.PI / 180);
};

export function sigmoid(x, pow){
	return 1 / (1 + Math.pow(Math.E, -((x - 0.5) * pow)));
}

export function get_random_point_on_sphere() {
	const random_pitch = (Math.random() * 2 - 1) * 89;
	const random_yaw = Math.random() * 360;
	const point = get_point_from_pitch_and_yaw(random_pitch, random_yaw);
	return point;
}

export function get_point_from_pitch_and_yaw(pitch, yaw){
	const y = Math.sin(deg_to_rad(pitch));
	const horiz_distance = Math.cos(deg_to_rad(pitch));
	const x = Math.sin(deg_to_rad(yaw)) * horiz_distance;
	const z = Math.cos(deg_to_rad(yaw)) * horiz_distance;
	return vec3.fromValues(x, y, z);
}

export function exponentialize(x, pow){
	return Math.pow(x, pow);
}

export function lerp(a, b, k) {
	return a + (b - a) * k;
}

// Based on: https://www.iquilezles.org/www/articles/smin/smin.htm
export function smin(a, b, k){
    const h = clamp(0.5 + 0.5 * (b - a) / k, 0, 1);
    return lerp(b, a, h) - k * h * (1 - h);
}

// Based on: https://en.wikipedia.org/wiki/Smooth_maximum
export function smax(a, b, k){
	return ((a + b) + Math.sqrt(Math.pow(a - b, 2) + k)) / 2;
}

export function clamp(v, a, b){
	if(v < a){
		return a;
	}else if(v > b){
		return b;
	}
	return v;
}