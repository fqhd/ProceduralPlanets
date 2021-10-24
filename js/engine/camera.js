'use strict';

const {mat4} = glMatrix;

import {to_radians} from '/js/engine/utils.js';

export function create_camera(ratio){
	const cam = {
		position: [0, 0, 0],
		pitch: 20,
		yaw: -20,
		view: mat4.create(),
	};
	calc_view_matrix(cam);
	cam.proj = calc_proj_matrix(ratio);
	return cam;
}

export function calc_view_matrix({position, view, pitch, yaw}){
	mat4.translate(view, view, position.map(n => n * -1));
	mat4.rotate(view, view, to_radians(pitch), [1, 0, 0]);
	mat4.rotate(view, view, to_radians(yaw), [0, 1, 0]);
}

function calc_proj_matrix(ratio){
	const proj = mat4.create();
	mat4.perspective(proj, 70, ratio, 0.1, 1000.0);
	return proj;
}