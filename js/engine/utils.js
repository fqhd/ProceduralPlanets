const {vec3} = glMatrix;

export function deg_to_rad(degrees) {
	return degrees * (Math.PI / 180);
};

export function rad_to_deg(rad) {
	return rad / (Math.PI / 180);
};

export function get_random_color(){
	const r = Math.random();
	const g = Math.random();
	const b = Math.random();
	return [r, g, b];
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

export function load_image(url){
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.src = url;
	});
}

export function clamp(v, a, b){
	if(v < a){
		return a;
	}else if(v > b){
		return b;
	}
	return v;
}