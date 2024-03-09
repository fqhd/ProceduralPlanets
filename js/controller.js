import { hex_to_rgb, hsv_to_rgb } from "./engine/utils.js";

let scene;
let is_mouse_down = false;
let animate = false;
let noise_offset = 0;

export function init_controls(s){
	scene = s;
	noise_offset = s.planet_params.generation_params.noise_offset;
	const canvas = document.getElementById('canvas');
	canvas.addEventListener('mousemove', on_mouse_move);
	canvas.addEventListener('wheel', on_mouse_wheel);
	canvas.addEventListener('mousedown', () => is_mouse_down = true);
	canvas.addEventListener('mouseup', () => is_mouse_down = false);
	document.body.addEventListener('keydown', keyDown);
	document.body.addEventListener('keyup', keyUp);
}

function keyUp(key) {
	if(key.key == ' ') {
		animate = false;
	}
}

function keyDown(key) {
	if(key.key == ' ') {
		animate = true;
	}
}

export function update_planet_params(){
	if(animate){
		noise_offset += 0.01;
	}
	scene.planet_params.generation_params.noise_offset += (noise_offset - scene.planet_params.generation_params.noise_offset) * 0.1;

	const gen_params = scene.planet_params.generation_params;
	gen_params.shape_frequency = (shape_frequency.value / 100) * 3;
	gen_params.warp_factor = (warp_factor.value / 100) * 10;
	gen_params.mountain_frequency = (mountain_frequency.value / 100) * 10;
	gen_params.mountain_height = (mountain_height.value / 100);
	gen_params.ridge_noise_frequency = (ridge_noise_frequency.value / 100) * 5;
	gen_params.ocean_depth = (ocean_depth.value / 100) * 0.5;
	gen_params.base_height = 0.1 + (base_height.value / 100) * 0.2;
	const color_params = scene.planet_params.color_params;
	color_params.snow_color = hex_to_rgb(snow_color.value);
	color_params.dirt_color = hex_to_rgb(dirt_color.value);
	color_params.grass_color = hex_to_rgb(grass_color.value);
	color_params.sand_color = hex_to_rgb(sand_color.value);
	const water_params = scene.planet_params.water_params;
	water_params.water_depth = (water_depth.value / 100);
	water_params.color_b = hsv_to_rgb(water_hue.value / 100, 0.5, 0.95);
	water_params.color_a = hsv_to_rgb(Math.max((water_hue.value / 100) - 0.2, 0.0), 0.5, 0.95);

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