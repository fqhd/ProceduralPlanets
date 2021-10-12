// We need to create 3 things, scene camera and renderer
const scene = new THREE.Scene();
const camera = new Three.CreatePerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// We must set the size of our renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// Then we have to append the renderers dom element(canvas) to the body of the DOM
document.body.appendChild(renderer.domElement);
