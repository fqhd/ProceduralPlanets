const { mat4, vec3 } = glMatrix;

import { deg_to_rad, get_point_from_pitch_and_yaw } from './maths.js';

export function create_camera(pitch, yaw, ratio){
	const cam = {
		position: vec3.create(),
		pitch,
		yaw,
		distance: 2,
		target_pitch: pitch,
		target_distance: 2,
		target_yaw: yaw,
		origin: [0, 0, 0],
		view: mat4.create(),
		projection: calc_proj_matrix(ratio),
	};
	return cam;
}

export function update_camera(camera){
	const {view, position, pitch, yaw, distance, target_pitch, target_yaw, target_distance} = camera;

	camera.distance += (target_distance - distance) * 0.1;
	camera.pitch += (target_pitch - pitch) * 0.1;
	camera.yaw += (target_yaw - yaw) * 0.1;

	// Calculate camera position based on pitch and yaw
	const point = get_point_from_pitch_and_yaw(camera.pitch, camera.yaw);
	vec3.scale(point, point, camera.distance);

	// Calculate view matrix
	mat4.identity(view);
	mat4.rotate(view, view, deg_to_rad(pitch), [1, 0, 0]);
	mat4.rotate(view, view, deg_to_rad(-yaw), [0, 1, 0]);
	mat4.translate(view, view, position.map(n => n * -1));

	// Update camera position
	camera.position[0] = point[0];
	camera.position[1] = point[1];
	camera.position[2] = point[2];
}

function calc_proj_matrix(ratio){
	const proj = mat4.create();
	mat4.perspective(proj, deg_to_rad(70), ratio, 0.1, 1000.0);
	return proj;
}
