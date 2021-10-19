'use strict';

export function createVAO(gl, positions, normals, indices){
	let id = gl.createVertexArray();
	gl.bindVertexArray(id);

	let posBuff = gl.genBuffers();
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

	let normalBuff = gl.genBuffers();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

	let indicesBuff = gl.genBuffers();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuff);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	return {
		vao,
		indicesBuff,
		numVertices: indices.length,
	};
}

export function drawVAO(gl, vao){
	gl.bindVertexArray(vao.vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vao.indices_buff);
	gl.drawElements(gl.TRIANGLES, vao.numVertices, gl.UNSIGNED_SHORT, 0);
}
