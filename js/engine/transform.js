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