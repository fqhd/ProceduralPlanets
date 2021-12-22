import { load_shaders, bind_shader_uniforms } from './engine/shader.js';
import { draw_scene, init_gl_state } from './engine/renderer.js';
import { create_camera } from './engine/camera.js';
import { init_controls } from './controller.js';
import { load_skybox } from './engine/skybox.js';
import { create_moon_model } from './engine/moon_generator.js';
import { load_textures } from './engine/texture.js';
import { get_random_color } from './engine/utils.js';

let nmap_strength_slider;
let nmap_scale_slider;
let nmap_sharpness_slider;

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
			params: get_moon_params(),
		},
		camera: create_camera(40, 0, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};


	init_gl_state(gl);
	bind_shader_uniforms(gl, shaders);
	init_controls(scene);
	init_sliders();
	return scene;
}

function init_sliders(){
	nmap_strength_slider = document.getElementById('nmap-strength');
	nmap_scale_slider = document.getElementById('nmap-scale');
	nmap_sharpness_slider = document.getElementById('nmap-sharpness');
}

export function update(gl, scene){
	const moon_params = scene.moon.params;
	moon_params.texture_scale = (nmap_scale_slider.value / 100) * 40;
	moon_params.blend_sharpness = (nmap_sharpness_slider.value / 100) * 50;
	moon_params.nmap_strength = nmap_strength_slider.value / 100;
}

export function draw(gl, scene){
	draw_scene(gl, scene);
}

function get_moon_params(){
	return {
		obj_color_1: get_random_color(),
		obj_color_2: get_random_color(),
		nmap_strength: 0.5,
		texture_scale: 3.5,
		blend_sharpness: 5.0,		
	}
}