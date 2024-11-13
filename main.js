import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

// Sun with Glow Effect
const textureLoader = new THREE.TextureLoader();
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load('/assets/textures/sun.jpg') });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

// Glow Effect for the Sun
const createGlow = (innerRadius, outerRadius, color) => {
	const glowGeometry = new THREE.SphereGeometry(innerRadius, 32, 32);
	const glowMaterial = new THREE.ShaderMaterial({
		uniforms: {
			c: { value: 0.5 },
			p: { value: 3.0 },
			glowColor: { value: new THREE.Color(color) },
			viewVector: { value: camera.position },
		},
		vertexShader: `
			uniform vec3 viewVector;
			uniform float c;
			uniform float p;
			varying float intensity;
			void main() {
				vec3 vNormal = normalize(normalMatrix * normal);
				vec3 vNormView = normalize(viewVector - modelViewMatrix * vec4(position, 1.0));
				intensity = pow(c - dot(vNormal, vNormView), p);
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}`,
		fragmentShader: `
			uniform vec3 glowColor;
			varying float intensity;
			void main() {
				gl_FragColor = vec4(glowColor, intensity);
			}`,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
	});
	const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
	glowMesh.scale.set(outerRadius / innerRadius, outerRadius / innerRadius, outerRadius / innerRadius);
	return glowMesh;
};

const sunGlow = createGlow(5, 10, 0xffff00);
sun.add(sunGlow);
scene.add(sun);

// Colors for planets and their orbits
const orbitColors = {
	'Mercury': 0xa9a9a9, // Gray
	'Venus': 0xffe4b5, // Light Golden
	'Earth': 0x1e90ff, // Blue
	'Mars': 0xff4500, // Red
	'Jupiter': 0xffa500, // Orange
	'Saturn': 0xffd700, // Yellow
	'Uranus': 0x00ffff, // Cyan
	'Neptune': 0x4682b4 // Steel Blue
};

// Planets
const planets = [];
const planetData = [
	{
		name: 'Mercury',
		texture: '/assets/textures/mercury.jpg',
		size: 0.383,
		distance: 10,
		info: 'Mercury is the smallest planet in the Solar System and closest to the Sun. It has no atmosphere, leading to extreme temperature variations.'
	},
	{
		name: 'Venus',
		texture: '/assets/textures/venus.jpg',
		size: 0.949,
		distance: 15,
		info: 'Venus is the hottest planet due to its thick atmosphere of carbon dioxide. It rotates in the opposite direction of most planets.'
	},
	{
		name: 'Earth',
		texture: '/assets/textures/earth.jpg',
		size: 1,
		distance: 20,
		info: 'Earth is the only planet known to support life. Its surface is 71% water, and it has a single moon, the Moon.'
	},
	{
		name: 'Mars',
		texture: '/assets/textures/mars.jpg',
		size: 0.532,
		distance: 25,
		info: 'Mars is known as the "Red Planet" due to its iron oxide-rich soil. It hosts the largest volcano in the Solar System, Olympus Mons.'
	},
	{
		name: 'Jupiter',
		texture: '/assets/textures/jupiter.jpg',
		size: 2,
		distance: 30,
		info: 'Jupiter is the largest planet in the Solar System. It has over 79 moons and features a giant storm known as the Great Red Spot.'
	},
	{
		name: 'Saturn',
		texture: '/assets/textures/saturn.jpg',
		size: 1.8,
		distance: 35,
		info: 'Saturn is famous for its stunning ring system made of ice and rock. It has 83 moons, including the large moon Titan.'
	},
	{
		name: 'Uranus',
		texture: '/assets/textures/uranus.jpg',
		size: 0.8,
		distance: 40,
		info: 'Uranus is a blue-green planet due to methane in its atmosphere. It rotates on its side, making its axis nearly horizontal.'
	},
	{
		name: 'Neptune',
		texture: '/assets/textures/neptune.jpg',
		size: 0.8,
		distance: 45,
		info: 'Neptune, the farthest planet from the Sun, has the fastest winds in the Solar System, reaching speeds of over 2,100 km/h.'
	},
];


// Add Planets to the Scene
planetData.forEach((data) => {
	const geometry = new THREE.SphereGeometry(data.size, 32, 32);
	const material = new THREE.MeshBasicMaterial({ map: textureLoader.load(data.texture) });
	const planet = new THREE.Mesh(geometry, material);
	planet.position.x = data.distance;
	planet.userData = { name: data.name, size: data.size, distance: data.distance, info: data.info };
	planets.push(planet);
	scene.add(planet);

	// Create Colored Orbit Line
	const orbitGeometry = new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 64);
	const orbitMaterial = new THREE.MeshBasicMaterial({
		color: orbitColors[data.name],
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 0.8
	});
	const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
	orbit.rotation.x = Math.PI / 2; // Rotate to lie flat
	scene.add(orbit);
});

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
		infoDiv.innerHTML = `
			<h2>${data.name}</h2>
			<p><strong>Details:</strong></p>
			<p>${data.info}</p>
			<button id="collapseButton">Collapse</button>
		`;
		infoDiv.style.display = 'block';

		// Add event listener to collapse button
		document.getElementById('collapseButton').addEventListener('click', () => {
			infoDiv.style.display = 'none';
		});

		// Zoom into object
		gsap.to(camera.position, {
			x: object.position.x,
			y: object.position.y,
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
