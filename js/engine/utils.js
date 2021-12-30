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

export function fill_arr_to_length(arr, len){
	const diff = len - arr.length;
	if(len > 0){
		for(let i = 0; i < diff; i++){
			arr.push(0);
		}
	}
}

export function get_resolution_from_num(n){
	for(let i = 0; i < n; i++){
		// const num_pow_2 = Math.pow(2, i);
		if(Math.pow(i, 2) >= n){
			return {
				width: i,
				height: i,
			}
		}
	}
}