const {vec3} = glMatrix;

export function deg_to_rad(degrees) {
	return degrees * (Math.PI / 180);
};

export function rad_to_deg(rad) {
	return rad / (Math.PI / 180);
};

export function get_point_from_pitch_and_yaw(pitch, yaw){
	const y = Math.sin(deg_to_rad(pitch));
	const horiz_distance = Math.cos(deg_to_rad(pitch));
	const x = Math.sin(deg_to_rad(yaw)) * horiz_distance;
	const z = Math.cos(deg_to_rad(yaw)) * horiz_distance;
	return vec3.fromValues(x, y, z);
}