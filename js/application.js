import { draw_scene, init_master_renderer } from './engine/master_renderer.js';
import { create_camera } from './engine/camera.js';
import { init_controls, update_planet_params } from './controller.js';

export async function init_application(gl){
	const scene = {
		time: 0,
		planet_params: {
			generation_params: {
				noise_frequency: 1.5,
				noise_offset: 0.0,
			},
			color_params: {
				texture_scale: 1.0,
				texture_strength: 1.0,
			},
			water_params: {
				water_depth: 1.0,
			}
		},
		camera: create_camera(40, 0, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};

	await init_master_renderer(gl);
	init_controls(scene);
	return scene;
}

let lastTime = 0;
export function draw(gl, scene, time){
	time = time * 0.001;
	scene.time = time;
	const deltaTime = time - lastTime;
	lastTime = time;
	update_planet_params(deltaTime);
	draw_scene(gl, scene);
}
