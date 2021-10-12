// We need to create 3 things, scene camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
const renderer = new THREE.WebGLRenderer();

// We must set the size of our renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// Then we have to append the renderers dom element(canvas) to the body of the DOM
document.body.appendChild(renderer.domElement);


// Customizing our scene
camera.position.set(0, 0, 100);
const material = new THREE.LineBasicMaterial( {color: 0x0000ff } );
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const ourLine = new THREE.Line(geometry, material);
scene.add(ourLine);

function animate(){
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();