let scene;
let is_mouse_down = false;

const sliders = {
	ocean_size: document.getElementById('ocean-size'),
	ocean_depth: document.getElementById('ocean-depth'),
	ocean_floor: document.getElementById('ocean-floor'),
	mountain_height: document.getElementById('mountain-height'),
	mountain_frequency: document.getElementById('mountain-frequency'),
	mountain_scale: document.getElementById('mountain-scale'),
	detail_frequency: document.getElementById('detail-frequency'),
	detail_scale: document.getElementById('detail-scale'),
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
	
	// Multiply every slider value by 0.01 to get a number between 0 and 1
	planet_params.ocean_size = sliders.ocean_size.value * 0.01;
	planet_params.ocean_depth = sliders.ocean_depth.value * 0.01;
	planet_params.ocean_floor = sliders.ocean_floor.value * 0.01;
	planet_params.mountain_height = sliders.mountain_height.value * 0.01;
	planet_params.mountain_frequency = sliders.mountain_frequency.value * 0.01;
	planet_params.mountain_scale = sliders.mountain_scale.value * 0.01;
	planet_params.detail_frequency = sliders.detail_frequency.value * 0.01;
	planet_params.detail_scale = sliders.detail_scale.value * 0.01;
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
