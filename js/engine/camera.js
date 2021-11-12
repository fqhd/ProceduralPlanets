'use strict';

const {mat4} = glMatrix;

import * as Utils from './utils.js';

export function create_camera(position, pitch, yaw, ratio){
	const cam = {
		position,
		pitch,
		yaw,
		forward: [0, 0, 0],
		velocity: [0, 0, 0],
		view: mat4.create(),
		projection: calc_proj_matrix(ratio),
	};
	return cam;
}

export function update_camera(camera){
	const {view, position, pitch, yaw} = camera;

	// Update position based on velocity
	camera.position[0] += camera.velocity[0];
	camera.position[1] += camera.velocity[1];
	camera.position[2] += camera.velocity[2];

	// Calculate view matrix
	mat4.identity(view);
	mat4.rotate(view, view, Utils.deg_to_rad(pitch), [1, 0, 0]);
	mat4.rotate(view, view, Utils.deg_to_rad(yaw), [0, 1, 0]);
	mat4.translate(view, view, position.map(n => n * -1));

	// Calculate forward vector
	// This calculation has been taken from https://learnopengl.com/Getting-started/Camera
	camera.forward[0] = Math.cos(Utils.deg_to_rad(yaw)) * Math.cos(Utils.deg_to_rad(pitch));
	camera.forward[1] = Math.sin(Utils.deg_to_rad(pitch));
	camera.forward[2] = Math.sin(Utils.deg_to_rad(yaw)) * Math.cos(Utils.deg_to_rad(pitch));
}

function calc_proj_matrix(ratio){
	const proj = mat4.create();
	mat4.perspective(proj, Utils.deg_to_rad(70), ratio, 0.1, 1000.0);
	return proj;
}
