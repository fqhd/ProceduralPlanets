let scene;
let is_mouse_down = false;
let animate = false;
let noiseOffset = 0;

export function init_controls(s){
	scene = s;
	const canvas = document.getElementById('canvas');
	canvas.addEventListener('mousemove', on_mouse_move);
	canvas.addEventListener('wheel', on_mouse_wheel);
	canvas.addEventListener('mousedown', () => is_mouse_down = true);
	canvas.addEventListener('mouseup', () => is_mouse_down = false);
	document.body.addEventListener('keydown', keyDown);
	document.body.addEventListener('keyup', keyUp);
}

function keyUp(key){
	if(key.key == ' '){
		animate = false;
	}
}

function keyDown(key){
	if(key.key == ' '){
		animate = true;
	}
}

export function update_planet_params(){
	if(animate){
		noiseOffset += 0.005;
	}
	scene.planet_params.generation_params.noise_offset += (noiseOffset - scene.planet_params.generation_params.noise_offset) * 0.1;
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
	scene.camera.target_distance += event.deltaY * 0.002;

	// Clamping
	if(scene.camera.target_distance < 1.4) scene.camera.target_distance = 1.4;
	if(scene.camera.target_distance > 20) scene.camera.target_distance = 20;

}
