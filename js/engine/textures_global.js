'use strict';

import {load_texture_from_file} from './texture.js';

export async function load_textures(gl){
    return {
        bricks_texture: await load_texture_from_file(gl, '/res/textures/bricks_texture.jpg'),
        bricks_normal: await load_texture_from_file(gl, '/res/textures/bricks_normal.jpg'),
    };
}
