import { get_noise, get_warped_noise } from './utils.js';

const { vec3 } = glMatrix;

export function scale_positions_with_noise(positions){
	const shape_scale = 0.02 + Math.random() * 0.05;
	const shape_freq = 1 + Math.random() * 5;

	for(let i = 0; i < positions.length; i+=3){
		const pos = vec3.fromValues(positions[i], positions[i+1], positions[i+2]);
		const scale_factor = get_scale_factor_from_pos(pos, shape_scale, shape_freq);
		vec3.scale(pos, pos, scale_factor);
		positions[i] = pos[0];
		positions[i+1] = pos[1];
		positions[i+2] = pos[2];
	}
}

function get_scale_factor_from_pos(pos, shape_scale, shape_freq){
	const detail_noise = get_noise(pos, 10 + Math.random() * 50) * (0.002 + Math.random() * 0.005);
	const shape_noise = get_noise(pos, shape_freq) * shape_scale;
	const warp_noise = get_warped_noise(pos, 0.4) * shape_scale;

	const base = 1;

	return base + shape_noise + detail_noise + warp_noise;
}
