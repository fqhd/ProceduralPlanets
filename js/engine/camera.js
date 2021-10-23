'use strict';

const {mat4} = glMatrix;

import {to_radians} from '/js/engine/utils.js';


export function calc_cam_matrix(position, ratio, pitch, yaw){
	const proj = mat4.create();
	mat4.perspective(proj, 70, ratio, 0.1, 1000.0);

	const view = mat4.create();
	mat4.translate(view, view, position.map(n => n * -1));
	mat4.rotate(view, view, to_radians(pitch), [1, 0, 0]);
	mat4.rotate(view, view, to_radians(yaw), [0, 1, 0]);

	return {
		view,
		proj,
	};
}