import {load_shaders, bind_shader_tex_attribs} from './engine/shader.js';
import {load_textured_models, load_raw_models} from './engine/model.js';
import {load_textures} from './engine/texture.js';
import {draw_scene, init_gl_state} from './engine/renderer.js';
import {create_camera} from './engine/camera.js';
import {init_transform} from './engine/transform.js';
import {init_controls} from './controller.js';
import {load_cubemap_from_file} from './engine/cubemap.js';
import {init_cube_model} from './engine/cube.js';


export async function init_application(gl){
	const [shaders, textured_models, raw_models, textures] = await Promise.all([
		load_shaders(gl),
		load_textured_models(gl),
		load_raw_models(gl),
		load_textures(gl),
	]);

	const scene = {
		shaders,
		skybox: {
			model: init_cube_model(gl),
			texture: load_cubemap_from_file(gl, 'res/textures/skybox/'),
		},
		raw_entities: [
			{
				reflectivity: 2,
				shine_damper: 50,
				color: [0.5, 0.5, 0.5],
				model: raw_models.bunny,
				transform: init_transform([4, 1.75, -3], [0, -90, 0], [30, 30, 30]),
			}
		],
		normal_mapped_entities: [
			{
				reflectivity: 1,
				shine_damper: 10,
				model: textured_models.plane,
				texture: textures.bricks_texture,
				normal_map: textures.bricks_normal,
				transform: init_transform([0, 0, -7], [0, 90, 0], [20, 20, 20]),
			},
		],
		lights: [
			{
				position: [0, 1, -2],
				color: [0.1, 0.6, 1],
				attenuation: [0.4, 0.08, 0.08],
			},
			{
				position: [-2, 1, -2],
				color: [0.9, 0.4, 0.2],
				attenuation: [0.4, 0.08, 0.08],
			},
		],
		camera: create_camera([-3, 1.5, 3], 40, 0, gl.canvas.clientWidth / gl.canvas.clientHeight),
	};

	init_gl_state(gl); // Initializing gl state out of promise
	bind_shader_tex_attribs(gl, shaders); // Send 0 or 1 to shader textures
	init_controls(scene);

	return scene;
}

let previous_time = 0;
export function draw(gl, scene, current_time){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const delta_time = (current_time - previous_time);
	previous_time = current_time;

	scene.lights[0].position[2] = Math.sin(current_time * 0.0015) * 4 - 4;
	scene.lights[1].position[2] = Math.cos(current_time * 0.0015) * 4 - 4;

	draw_scene(gl, scene, delta_time);
}
