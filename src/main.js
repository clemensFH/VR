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
	mass: '2×1030 kg',
};

scene.add(sun);

// Planets
const planets = [];
const planetData = getPlanetsData();


const today = new Date();
const referenceDate = new Date('2000-01-01'); // Reference date
const daysSinceReference = Math.floor((today - referenceDate) / (1000 * 60 * 60 * 24)); // Days since reference

planetData.forEach((data) => {
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: textureLoader.load(data.texture) });
    const planet = new THREE.Mesh(geometry, material);

    // Calculate initial angle
    const angle = ((daysSinceReference % data.orbitalPeriod) / data.orbitalPeriod) * 2 * Math.PI;
    planet.position.x = data.distance * Math.cos(angle);
    planet.position.z = data.distance * Math.sin(angle);
    planet.userData = data;

    planets.push(planet);
    scene.add(planet);

    // Create Orbit Line
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: data.orbitColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2; // Rotate to lie flat
    scene.add(orbit);

    // Add label
    const label = createTextLabel(data.name);
    label.position.set(0, data.size + 1, 0);
    planet.add(label);
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

const dateDisplay = document.createElement('div');
dateDisplay.innerText = `Date: ${today.toDateString()}`;
dateDisplay.style.position = 'absolute';
dateDisplay.style.top = '10px';
dateDisplay.style.left = '10px';
dateDisplay.style.color = 'white';
dateDisplay.style.fontFamily = 'Arial';
dateDisplay.style.fontSize = '16px';
dateDisplay.style.zIndex = '1';
document.body.appendChild(dateDisplay);


// Create a speed slider
const speedSlider = document.createElement('input');
speedSlider.type = 'range';
speedSlider.min = '1'; // Minimum multiplier
speedSlider.max = '50'; // Maximum multiplier for high speeds
speedSlider.step = '1'; // Step for smoother control
speedSlider.value = '1'; // Default multiplier
speedSlider.style.position = 'absolute';
speedSlider.style.bottom = '20px';
speedSlider.style.left = '50%';
speedSlider.style.transform = 'translateX(-50%)';
speedSlider.style.zIndex = '1';
document.body.appendChild(speedSlider);

// Create a label for the slider
const speedLabel = document.createElement('div');
speedLabel.innerText = `Speed: ${speedSlider.value}x`;
speedLabel.style.position = 'absolute';
speedLabel.style.bottom = '50px';
speedLabel.style.left = '50%';
speedLabel.style.transform = 'translateX(-50%)';
speedLabel.style.color = 'white';
speedLabel.style.fontFamily = 'Arial';
speedLabel.style.zIndex = '1';
document.body.appendChild(speedLabel);

// Update label on slider change
speedSlider.addEventListener('input', () => {
    speedLabel.innerText = `Speed: ${speedSlider.value}x`;
});


let lastTime = 0;
let selectedObject = null;

const animate = (currentTime) => {
    requestAnimationFrame(animate);

    // Calculate time delta for smooth animation
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Get the speed multiplier from the slider
    const speedMultiplier = parseFloat(speedSlider.value);

    // Rotate planets around the Sun
    planets.forEach((planet, index) => {
        const baseSpeed = 0.01 + index * 0.01;
        const adjustedSpeed = baseSpeed * speedMultiplier;

        // Use deltaTime to smooth movement
        const angle = adjustedSpeed * deltaTime * 0.0001;
        const currentX = planet.position.x;
        const currentZ = planet.position.z;

        // Update position using a rotation matrix
        planet.position.x = currentX * Math.cos(angle) - currentZ * Math.sin(angle);
        planet.position.z = currentX * Math.sin(angle) + currentZ * Math.cos(angle);
    });

    // If an object is selected, keep the camera focused on it
    if (selectedObject) {
        controls.target.copy(selectedObject.position);
        controls.update();
    }

    renderer.render(scene, camera);
};
animate(0);

const resetButton = document.createElement('button');
resetButton.innerText = 'Reset View';
resetButton.style.position = 'absolute';
resetButton.style.top = '20px';
resetButton.style.right = '20px';
resetButton.style.zIndex = '1';
resetButton.style.padding = '10px 20px';
resetButton.style.fontSize = '16px';
document.body.appendChild(resetButton);

// Reset the view on button click
resetButton.addEventListener('click', () => {
    selectedObject = null;

    // Smoothly zoom out to the default view
    gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 50,
        duration: 1.5,
        onUpdate: () => controls.update(),
    });

    controls.target.set(0, 0, 0); // Reset target to the center
    controls.update();
});


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

        // Set the selected object
        selectedObject = object;

        // Smoothly zoom into the object
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
