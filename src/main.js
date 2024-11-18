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

// Sun with Glow Effect
const textureLoader = new THREE.TextureLoader();
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load('/sun.jpg') });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
// Sun userData
sun.userData = {
	name: 'Sun',
	info: 'The Sun is the star at the center of the Solar System. It provides light and heat to all planets. It is a nearly perfect sphere of hot plasma and is by far the most important source of energy for life on Earth. The Sun has no solid surface and consists mostly of hydrogen and helium.'
};

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
		color:data.orbitColor,
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
	//console.log(data)
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
			<p><strong>Radius:</strong> ${data.mass}</p>
			<button id="collapseButton">Collapse</button>
		`;
        infoDiv.className = "planetinfo";

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
