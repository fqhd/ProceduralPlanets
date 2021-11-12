'use strict';

export function deg_to_rad(degrees) {
	return degrees * (Math.PI / 180);
};
  
export function rad_to_deg(rad) {
	return rad / (Math.PI / 180);
};

export function copy_array(arr1, arr2){
	for(let i = 0; i < arr2.length; i++){
		arr1[i] = arr2[i];
	}
}

export function sub_vec2(a, b){
	return [a[0] - b[0], a[1] - b[1]];
}

export function sub_vec3(a, b){
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function mul_vec3(a, b){
	return [a[0] * b, a[1] * b, a[2] * b];
}

export function cross_vec3(a, b){
	return [a[1] * b[2] - a[2] * b[1],
			a[2] * b[0] - a[0] * b[2],
			a[0] * b[1] - a[1] * b[0]];
}