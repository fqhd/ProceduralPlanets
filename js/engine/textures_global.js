'use strict';

import {load_texture_from_file} from '/js/engine/texture.js';

export async function load_textures(gl){
    return {
        bricks: await load_texture_from_file(gl, '/res/textures/bricks.jpg'),
    };
}
