export function deg_to_rad(degrees) {
	return degrees * (Math.PI / 180);
};

export function rad_to_deg(rad) {
	return rad / (Math.PI / 180);
};

export function load_image(url){
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.src = url;
	});
}