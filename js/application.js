import { draw_scene, init_master_renderer } from './engine/master_renderer.js';
import { create_camera } from './engine/camera.js';
import { init_controls, update_planet_params } from './controller.js';

export async function init_application(gl){
	const scene = {
		time: 0,
		planet_params: {
			generation_params: {
				noise_frequency: undefined,
				noise_offset: undefined,
				noise_scale: undefined,
			},
			color_params: {
				texture_scale: undefined,
				texture_strength: undefined,
				grass_threshold: undefined,
				snow_threshold: undefined,
			},
			water_params: {
				water_depth: undefined,
			}
		},
		camera: create_camera(40, 0, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};

	await init_master_renderer(gl);
	init_controls(scene);
	return scene;
}

export function draw(gl, scene, time){
	scene.time = time * 0.001;
	update_planet_params();
	draw_scene(gl, scene);
}