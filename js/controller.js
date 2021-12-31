let scene;
let is_mouse_down = false;

const sliders = {
	ocean_size: document.getElementById('ocean-size'),
};

export function init_controls(s){
	scene = s;
	const canvas = document.getElementById('canvas');
	canvas.addEventListener('mousemove', on_mouse_move);
	canvas.addEventListener('wheel', on_mouse_wheel);
	canvas.addEventListener('mousedown', () => is_mouse_down = true);
	canvas.addEventListener('mouseup', () => is_mouse_down = false);
}

export function update_planet_params(){
	const planet_params = scene.planet_params;
	
	planet_params.ocean_size = sliders.ocean_size.value;
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
	if(scene.camera.target_distance > 30) scene.camera.target_distance = 30;

}
