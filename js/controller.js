let scene;
let is_mouse_down = false;

const nmap_strength_slider = document.getElementById('nmap-strength');
const nmap_scale_slider = document.getElementById('nmap-scale');
const nmap_sharpness_slider = document.getElementById('nmap-sharpness');

export function init_controls(s){
	scene = s;
	const canvas = document.getElementById('canvas');
	canvas.addEventListener('mousemove', on_mouse_move);
	canvas.addEventListener('wheel', on_mouse_wheel);
	canvas.addEventListener('mousedown', () => is_mouse_down = true);
	canvas.addEventListener('mouseup', () => is_mouse_down = false);
}

export function update_controller(){
	const moon_params = scene.moon.params;
	moon_params.texture_scale = (nmap_scale_slider.value / 100) * 40;
	moon_params.blend_sharpness = (nmap_sharpness_slider.value / 100) * 50;
	moon_params.nmap_strength = nmap_strength_slider.value / 100;
}

function on_mouse_move(event){
	if(!is_mouse_down) return;
	scene.camera.target_pitch += event.movementY * 0.6;
	scene.camera.target_yaw -= event.movementX * 0.6;

	// Clamping
	if(scene.camera.target_pitch > 89) scene.camera.target_pitch = 89;
	if(scene.camera.target_pitch < -89) scene.camera.target_pitch = -89;
}

function on_mouse_wheel(event){
	scene.camera.target_distance += event.deltaY * 0.02;

	// Clamping
	if(scene.camera.target_distance < 1.5) scene.camera.target_distance = 1.5;
	if(scene.camera.target_distance > 30) scene.camera.target_distance = 30;

}
