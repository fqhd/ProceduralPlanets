'use strict';

const {mat4} = glMatrix;

import {to_radians} from '/js/engine/utils.js'

export function init_transform(pos, rot, scale){
	const m = mat4.create();
	mat4.translate(m, m, pos);
	mat4.rotate(m, m, to_radians(rot[0]), [1, 0, 0]);
	mat4.rotate(m, m, to_radians(rot[1]), [0, 1, 0]);
	mat4.rotate(m, m, to_radians(rot[2]), [0, 0, 1]);
	mat4.scale(m, m, scale);
	return {
		pos,
		rot,
		scale,
		matrix: m,
	};
}

export function translate_transform(transform, dist){
	mat4.translate(transform.matrix, transform.matrix, dist);
	transform.pos += dist;
}

export function rotate_transform(transform, rot){
	mat4.rotate(transform.matrix, transform.matrix, to_radians(rot[0]), [1, 0, 0]);
	mat4.rotate(transform.matrix, transform.matrix, to_radians(rot[1]), [0, 1, 0]);
	mat4.rotate(transform.matrix, transform.matrix, to_radians(rot[2]), [0, 0, 1]);
	transform.rot += rot;
}

export function scale_transform(transform, scale){
	mat4.scale(transform.matrix, transform.matrix, scale);
	transform.scale += scale;
}