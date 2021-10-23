'use strict';

export async function initGLState(gl){
	gl.clearColor(0, 0, 0, 1);
	gl.frontFace(gl.CW);
	gl.disable(gl.CULL_FACE);
}

export function renderScene(gl, sceneData){
	drawModel(gl, sceneData.entity.model);
}

function drawModel(gl, model){
	gl.bindVertexArray(model.vao);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indicesBuff);
	gl.drawElements(gl.TRIANGLES, model.numIndices, gl.UNSIGNED_SHORT, 0);
}
