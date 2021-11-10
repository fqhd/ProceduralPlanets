'use strict';

const {mat4} = glMatrix;

import {to_radians} from './utils.js'

export function init_transform(position, rotation, scale){
	return {
		position,
		rotation,
		scale,
		matrix: mat4.create(),
	};
}

export function update_transform(transform){
	const {matrix, rotation, position, scale} = transform;

	mat4.identity(matrix);
	mat4.translate(matrix, matrix, position);
	mat4.rotate(matrix, matrix, to_radians(rotation[0]), [1, 0, 0]);
	mat4.rotate(matrix, matrix, to_radians(rotation[1]), [0, 1, 0]);
	mat4.rotate(matrix, matrix, to_radians(rotation[2]), [0, 0, 1]);
	mat4.scale(matrix, matrix, scale);
}