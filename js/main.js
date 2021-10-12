// We need to create 3 things, scene camera and renderer
const scene = new THREE.Scene();
const camera = new Three.CreatePerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

// We must set the size of our renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// Then we have to append the renderers dom element(canvas) to the body of the DOM
document.body.appendChild(renderer.domElement);

const geometry = THREE.BoxGeometry(); // Create the geometry for the cube(vertices and faces)
const material = THREE.MeshBasicMaterial( { color: 0x00FF00} ); // Create the material of the cube (texture)
const mesh = THREE.Mesh(geometry, material); // Create a mesh object using the geometry and the texture(just to group everything together mostly)
scene.add(cube); // Add it to our scene(Again, just something Three.js decided.)
