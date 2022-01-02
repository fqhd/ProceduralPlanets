let scene;
let is_mouse_down = false;
const sliders = {};

function init_sliders(planet_params){
	for(const param_name in planet_params.generation_params){
		sliders[param_name] = document.getElementById(param_name);
	}
	for(const param_name in planet_params.color_params){
		sliders[param_name] = document.getElementById(param_name);
	}
}

export function init_controls(s){
	scene = s;
	init_sliders(scene.planet_params);
	const canvas = document.getElementById('canvas');
	canvas.addEventListener('mousemove', on_mouse_move);
	canvas.addEventListener('wheel', on_mouse_wheel);
	canvas.addEventListener('mousedown', () => is_mouse_down = true);
	canvas.addEventListener('mouseup', () => is_mouse_down = false);
}

export function update_planet_params(){
	const planet_params = scene.planet_params;
	
	// Multiply every slider value by 0.01 to get a number between 0 and 1
	for(const param_name in planet_params.generation_params){
		planet_params.generation_params[param_name] = sliders[param_name].value * 0.01;
	}
	for(const param_name in planet_params.color_params){
		planet_params.color_params[param_name] = sliders[param_name].value * 0.01;
	}
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
	if(scene.camera.target_distance < 1.2) scene.camera.target_distance = 1.2;
	if(scene.camera.target_distance > 200) scene.camera.target_distance = 200;

}
