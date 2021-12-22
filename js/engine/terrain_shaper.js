const { vec3 } = glMatrix;

export function scale_positions_with_noise(positions){
	for(let i = 0; i < positions.length; i+=3){
		const pos = vec3.fromValues(positions[i], positions[i+1], positions[i+2]);
		const scale_factor = get_scale_factor_from_pos(pos);
		vec3.scale(pos, pos, scale_factor);
		positions[i] = pos[0];
		positions[i+1] = pos[1];
		positions[i+2] = pos[2];
	}
}

function get_scale_factor_from_pos(pos){
	const detail_noise = get_detail_noise(pos, 50, 0.003);
	const shape_noise = get_shape_noise(pos, 2, 0.03);
	const base = 1;

	return base + shape_noise + detail_noise;
}

function get_detail_noise(pos, frequency, scale){
	return get_noise(pos, noise.perlin3, frequency) * scale;
}

function get_shape_noise(pos, frequency, scale){
	return get_noise(pos, noise.simplex3, frequency) * scale;
}

export function get_noise(pos, func, freq){
	return func(pos[0] * freq,
		pos[1] * freq,
		pos[2] * freq);
}