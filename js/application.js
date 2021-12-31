import { draw_scene, init_master_renderer } from './engine/master_renderer.js';
import { create_camera } from './engine/camera.js';
import { init_controls, update_planet_params } from './controller.js';

export async function init_application(gl){
	const scene = {
		planet_params: {
		},
		camera: create_camera(40, 0, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};

	await init_master_renderer(gl);
	init_controls(scene);
	return scene;
}

export function draw(gl, scene){
	update_planet_params();
	draw_scene(gl, scene);
}