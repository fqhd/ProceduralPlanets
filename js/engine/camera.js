const {mat4} = glMatrix;

import * as Utils from './utils.js';

export function create_camera(position, pitch, yaw, ratio){
	const cam = {
		position,
		pitch,
		yaw,
		distance: 1,
		target_pitch: pitch,
		target_distance: 10,
		target_yaw: yaw,
		origin: [0, 0, 0],
		view: mat4.create(),
		projection: calc_proj_matrix(ratio),
	};
	return cam;
}

export function update_camera(camera, delta_time){
	const {view, position, pitch, yaw, distance, target_pitch, target_yaw, target_distance} = camera;

	camera.distance += (target_distance - distance) * 7.0 * (delta_time || 0.1);
	camera.pitch += (target_pitch - pitch) * 7.0 * (delta_time || 0.1);
	camera.yaw += (target_yaw - yaw) * 7.0 * (delta_time || 0.1);


	// Calculate camera position based on pitch and yaw
	const y = Math.sin(Utils.deg_to_rad(pitch)) * distance;
	const horiz_distance = Math.cos(Utils.deg_to_rad(pitch)) * distance;
	const x = Math.sin(Utils.deg_to_rad(yaw)) * horiz_distance;
	const z = Math.cos(Utils.deg_to_rad(yaw)) * horiz_distance;

	camera.position = [x, y, z];

	// Calculate view matrix
	mat4.identity(view);
	mat4.rotate(view, view, Utils.deg_to_rad(pitch), [1, 0, 0]);
	mat4.rotate(view, view, Utils.deg_to_rad(-yaw), [0, 1, 0]);
	mat4.translate(view, view, position.map(n => n * -1));
}

function calc_proj_matrix(ratio){
	const proj = mat4.create();
	mat4.perspective(proj, Utils.deg_to_rad(70), ratio, 0.1, 1000.0);
	return proj;
}
