import { load_shaders, bind_shader_uniforms } from './engine/shader.js';
import { draw_scene, init_gl_state } from './engine/renderer.js';
import { create_camera } from './engine/camera.js';
import { init_controls } from './controller.js';
import { load_skybox } from './engine/skybox.js';
import { create_moon_model } from './engine/moon_generator.js';
import { load_textures } from './engine/texture.js';

export async function init_application(gl){
	noise.seed(Math.random());
	
	const [shaders, skybox, textures] = await Promise.all([
		load_shaders(gl),
		load_skybox(gl),
		load_textures(gl),
	]);

	const scene = {
		shaders,
		skybox,
		moon: {
			model: create_moon_model(gl),
			normal_map_1: textures.normal_map_1,
			normal_map_2: textures.normal_map_2,
		},
		camera: create_camera(40, 0, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};


	init_gl_state(gl);
	bind_shader_uniforms(gl, shaders);
	init_controls(scene);

	return scene;
}

export function draw(gl, scene){
	draw_scene(gl, scene);
}
