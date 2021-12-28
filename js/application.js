import { draw_scene, init_master_renderer } from './engine/master_renderer.js';
import { create_camera } from './engine/camera.js';
import { init_controls, update_moon } from './controller.js';

export async function init_application(gl){
	const scene = {
		moon: {
			test_value: 0,
		},
		camera: create_camera(40, 0, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};

	await init_master_renderer(gl);
	init_controls(scene);
	return scene;
}

export function draw(gl, scene){
	update_moon();
	draw_scene(gl, scene);
}