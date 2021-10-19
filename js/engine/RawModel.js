'use strict';

class RawModel {
	#vao;
	#indices_buff;
	#num_vertices;

	constructor(gl, positions, normals, indices){
		this.#vao = gl.createVertexArray();
		gl.bindVertexArray(this.#vao);

		let pos_buff = gl.genBuffers();
		gl.bindBuffer(gl.ARRAY_BUFFER, pos_buff);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

		let normal_buff = gl.genBuffers();
		gl.bindBuffer(gl.ARRAY_BUFFER, normal_buff);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

		this.#indices_buff = gl.genBuffers();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indices_buff);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	}

	draw(){
		gl.bindVertexArray(this.#vao);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indices_buff);
		gl.drawElements(gl.TRIANGLES, this.#num_vertices, gl.UNSIGNED_SHORT, 0);
	}

}
