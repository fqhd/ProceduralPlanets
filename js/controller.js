let scene;
let is_mouse_down = false;

export function init_controls(s){
	scene = s;
	window.addEventListener('mousemove', on_mouse_move);
	window.addEventListener('wheel', on_mouse_wheel);
	window.addEventListener('mousedown', () => is_mouse_down = true);
	window.addEventListener('mouseup', () => is_mouse_down = false);
}

function on_mouse_move(event){
	if(!is_mouse_down) return;
	scene.camera.pitch += event.movementY;
	scene.camera.yaw -= event.movementX;
}

function on_mouse_wheel(event){
	scene.camera.distance += event.deltaY * 0.05;
}

