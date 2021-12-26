import { init_gl_state, clear } from './base_renderer.js';
import { init_moon_renderer, draw_moon } from './moon_renderer.js';
import { init_skybox_renderer, draw_skybox } from './skybox_renderer.js';
import { update_camera } from './camera.js';

export async function init_master_renderer(gl){
	init_gl_state(gl);
	await init_moon_renderer(gl);
	await init_skybox_renderer(gl);
}

export function draw_scene(gl, scene){
	clear(gl);
	
	update_camera(scene.camera);

	draw_moon(gl, scene);
	draw_skybox(gl, scene);
}
