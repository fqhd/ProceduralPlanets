const {vec3} = glMatrix;

export function get_random_color(){
	const r = Math.random();
	const g = Math.random();
	const b = Math.random();
	return [r, g, b];
}

export function load_image(url){
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.src = url;
	});
}

export function get_noise(pos, freq){
	return noise.perlin3(pos[0] * freq,
		pos[1] * freq,
		pos[2] * freq);
}

export function get_warped_noise(pos, freq) {
	const p1 = vec3.create();
	vec3.add(p1, pos, vec3.fromValues(0, 0, 0));

	const p2 = vec3.create();
	vec3.add(p2, pos, vec3.fromValues(5.2, 1.3, 5.2));

	const p3 = vec3.create();
	vec3.add(p3, pos, vec3.fromValues(3.5, 1.5, 2.3));

    const q = vec3.fromValues(get_noise(p1, freq), get_noise(p2, freq), get_noise(p3, freq));

	const q4 = vec3.create();
	vec3.scale(q4, q, 4);

	const aq4 = vec3.create();
	vec3.add(aq4, q4, pos);

	const ap1 = vec3.create();
	vec3.add(ap1, aq4, vec3.fromValues(1.7, 9.2, 7.8));

	const ap2 = vec3.create();
	vec3.add(ap2, aq4, vec3.fromValues(6.7, 1.2, 3.8));

	const ap3 = vec3.create();
	vec3.add(ap3, aq4, vec3.fromValues(3.7, 6.2, 5.8));

    const r = vec3.fromValues(get_noise(ap1, freq), get_noise(ap2, freq), get_noise(ap3, freq));

	const r4 = vec3.create();
	vec3.scale(r4, r, 4);

	const qr = vec3.create();
	vec3.add(qr, r4, pos);

    return get_noise(qr, 1);
}

export function get_prime_factors(n) {
	const factors = [];
	let divisor = 2;

	while (n >= 2) {
		if (n % divisor == 0) {
			factors.push(divisor);
			n = n / divisor;
		} else {
			divisor++;
		}
	}

	return factors;
}

export function get_resolution_from_num(n){
	const factors = get_prime_factors(n);

	factors.sort();

	let width = 1;
	let height = 1;

	for(let i = factors.length - 1; i >= 0; i--){
		if(width < height){
			width *= factors[i];
		}else{
			height *= factors[i];
		}
	}

	return {width, height};
}