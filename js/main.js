function main(){
	// Querying the canvas from the DOM
	const canvas = document.querySelector('#canvas');

	// Creating webgl context
	const gl = canvas.getContext('webgl');

	// Error checking(exiting if the context creation failed)
	if(gl === null){
		alert('Failed to initialize webgl. Your browser may not support it.');
		return;
	}
}
function changeChampName(){
	let element = document.getElementById('Champ');
	element.innerHTML = 'Fahd Baba';
}

window.onload = changeChampName;
