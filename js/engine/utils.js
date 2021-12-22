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
