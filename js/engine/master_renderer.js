import { init_gl_state, clear } from './base_renderer.js';
import { init_planet_renderer, prepare_planet_rendering, render_final_planet } from './planet_renderer.js';
import { init_skybox_renderer, draw_skybox } from './skybox_renderer.js';
import { update_camera } from './camera.js';

export async function init_master_renderer(gl){
	init_gl_state(gl);
	await init_planet_renderer(gl);
	await init_skybox_renderer(gl);
}

export function draw_scene(gl, scene){
	update_camera(scene.camera);

	prepare_planet_rendering(gl, scene);
	draw_skybox(gl, scene);
	render_final_planet(gl, scene);
}
