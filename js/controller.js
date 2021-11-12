let scene;
let is_mouse_down = false;

export function init_controls(s){
	scene = s;
	window.addEventListener('mousemove', on_mouse_move);
	window.addEventListener('mousedown', () => is_mouse_down = true);
	window.addEventListener('mouseup', () => is_mouse_down = false);
}

function on_mouse_move(event){
	if(!is_mouse_down) return;
	console.log('mouse is being dragged');
}


