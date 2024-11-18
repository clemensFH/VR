import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getPlanetsData } from '../utils';

// Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 50;
controls.update();

// Background with Stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const starVertices = [];
for (let i = 0; i < 10000; i++) {
	const x = THREE.MathUtils.randFloatSpread(2000);
	const y = THREE.MathUtils.randFloatSpread(2000);
	const z = THREE.MathUtils.randFloatSpread(2000);
	starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Sun
const textureLoader = new THREE.TextureLoader();
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load('/sun.jpg') });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
// Sun userData
sun.userData = {
	name: 'Sun',
	info: 'The Sun is the star at the center of the Solar System. It provides light and heat to all planets.',
	speed: 'N/A',
	radius: '696,340 km',
	siderealYear: 'N/A',
	surface: '6.09x10^12 km²',
	volume: '1.41x10^18 km³',
};

scene.add(sun);

// Planets
const planets = [];
const planetData = getPlanetsData();


// Add Planets to the Scene
planetData.forEach((data) => {
	const geometry = new THREE.SphereGeometry(data.size, 32, 32);
	const material = new THREE.MeshBasicMaterial({ map: textureLoader.load(data.texture) });
	const planet = new THREE.Mesh(geometry, material);
	planet.position.x = data.distance;
	planet.userData = data;
	planets.push(planet);
	scene.add(planet);

	// Create Colored Orbit Line
	const orbitGeometry = new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 64);
	const orbitMaterial = new THREE.MeshBasicMaterial({
		color: data.orbitColor,
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 0.8
	});
	const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
	orbit.rotation.x = Math.PI / 2; // Rotate to lie flat
	scene.add(orbit);

	// Add name label for the planet
	const planetLabel = createTextLabel(data.name);
	planetLabel.position.set(0, data.size + 1, 0);
	planet.add(planetLabel);
});

// Function to create text labels
function createTextLabel(text) {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	context.font = 'Bold 20px Arial';
	context.fillStyle = 'white';
	context.fillText(text, 0, 20);

	const texture = new THREE.CanvasTexture(canvas);
	const spriteMaterial = new THREE.SpriteMaterial({
		map: texture,
		transparent: true,
		depthTest: false,
		depthWrite: false
	});
	const sprite = new THREE.Sprite(spriteMaterial);
	sprite.scale.set(5, 2.5, 5);

	return sprite;
}

// Animation
const animate = () => {
	requestAnimationFrame(animate);

	// Rotate planets around the sun
	planets.forEach((planet, index) => {
		const speed = 0.01 + index * 0.01;
		planet.position.x = Math.cos(speed * Date.now() * 0.0001) * planet.userData.distance;
		planet.position.z = Math.sin(speed * Date.now() * 0.0001) * planet.userData.distance;
	});

	controls.update();
	renderer.render(scene, camera);
};
animate();

// Raycaster for Click Events
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects([sun, ...planets]);

	if (intersects.length > 0) {
		const object = intersects[0].object;
		const data = object.userData;

		// Show Info
		const infoDiv = document.getElementById('info');
		infoDiv.style.display = 'block';
		infoDiv.innerHTML = `
            <h2>${data.name}</h2>
            <p>${data.info}</p>
            <h4><strong>Details:</strong></h4>
            <p><strong>Speed:</strong> ${data.speed}</p>
            <p><strong>Radius:</strong> ${data.radius}</p>
            <p><strong>Year:</strong> ${data.siderealYear}</p>
            <p><strong>Surface:</strong> ${data.surface}</p>
            <p><strong>Volume:</strong> ${data.volume}</p>
            <p><strong>Mass:</strong> ${data.mass}</p>
            <button id="collapseButton">Collapse</button>
        `;
		infoDiv.className = "planetinfo";

		// Add event listener to collapse button
		document.getElementById('collapseButton').addEventListener('click', () => {
			infoDiv.style.display = 'none';
		});

		// Update Camera Target
		controls.target.copy(object.position); // Set the target to the clicked object
		controls.update();

		// Smooth Camera Zoom
		gsap.to(camera.position, {
			x: object.position.x + 10,
			y: object.position.y + 10,
			z: object.position.z + 10,
			duration: 1.5,
			onUpdate: () => controls.update(),
		});
	}
}


// Attach Events
window.addEventListener('click', onMouseClick);

// Resize Handler
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
