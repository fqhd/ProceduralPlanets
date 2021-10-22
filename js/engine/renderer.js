'use strict';

function drawModel(gl, model){
	gl.bindVertexArray(model.vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indicesBuff);
	gl.drawElements(gl.TRIANGLES, model.numIndices, gl.UNSIGNED_SHORT, 0);
}
