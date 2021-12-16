import { load_shaders } from './engine/shader.js';
import { draw_scene, init_gl_state } from './engine/renderer.js';
import { create_camera } from './engine/camera.js';
import { init_controls } from './controller.js';
import { load_skybox } from './engine/skybox.js';
import { create_planet_model } from './engine/planet.js';


export async function init_application(gl){
	noise.seed(Math.random());
	
	const [shaders, skybox] = await Promise.all([
		load_shaders(gl),
		load_skybox(gl),
	]);

	const scene = {
		shaders,
		skybox,
		planet: {
			model: create_planet_model(gl),
		},
		camera: create_camera(40, 0, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};

	init_gl_state(gl);
	init_controls(scene);

	return scene;
}

export function draw(gl, scene){
	draw_scene(gl, scene);
}
