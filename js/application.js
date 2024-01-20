import { draw_scene, init_master_renderer } from './engine/master_renderer.js';
import { create_camera } from './engine/camera.js';
import { get_random_color, hsv_to_rgb } from './engine/utils.js';

export function create_scene(gl) {
	const random_water_hue = Math.random();
	const scene = {
		time: 0,
		planet_params: {
			generation_params: {
				shape_frequency: Math.random() * 3.0,
				noise_offset: Math.random() * 10000.0,
				warp_factor: Math.random() * 10.0,
				mountain_frequency: Math.random() * 10.0,
				mountain_height: Math.random(),
				ridge_noise_frequency: Math.random() * 5.0,
				ocean_depth: Math.random() * 0.5,
				base_height: 0.1 + Math.random() * 0.2
			},
			color_params: {
				texture_scale: 1.0,
				texture_strength: 1.0,
				snow_color: get_random_color(),
				dirt_color: get_random_color(),
				grass_color: get_random_color(),
				sand_color: get_random_color()
			},
			water_params: {
				water_depth: Math.random(),
				color_b: hsv_to_rgb(random_water_hue, 0.5, 0.95),
				color_a: hsv_to_rgb(Math.max(random_water_hue - 0.2, 0.0), 0.5, 0.95)
			}
		},
		camera: create_camera(Math.random() * 50.0, -20.0 + Math.random() * 40.0, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};
	return scene;
}

export async function init_application(gl){
	await init_master_renderer(gl);
}

let lastTime = 0;
export function draw(gl, scene, time){
	time = time * 0.001;
	scene.time = time;
	lastTime = time;
	draw_scene(gl, scene);
}
