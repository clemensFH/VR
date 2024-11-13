export function getPlanetsData(){
    const planetData = [
        {
            name: 'Mercury',
            texture: '/mercury.jpg',
            size: 0.383,
            distance: 10,
            info: 'Mercury is the smallest planet in the Solar System and closest to the Sun. It has no atmosphere, leading to extreme temperature variations.',
            orbitColor: 0xa9a9a9
        },
        {
            name: 'Venus',
            texture: '/venus.jpg',
            size: 0.949,
            distance: 15,
            info: 'Venus is the hottest planet due to its thick atmosphere of carbon dioxide. It rotates in the opposite direction of most planets.',
            orbitColor: 0xffe4b5
        },
        {
            name: 'Earth',
            texture: '/earth.jpg',
            size: 1,
            distance: 20,
            info: 'Earth is the only planet known to support life. Its surface is 71% water, and it has a single moon, the Moon.',
            orbitColor: 0x1e90ff
        },
        {
            name: 'Mars',
            texture: '/mars.jpg',
            size: 0.532,
            distance: 25,
            info: 'Mars is known as the "Red Planet" due to its iron oxide-rich soil. It hosts the largest volcano in the Solar System, Olympus Mons.',
            orbitColor: 0xff4500
        },
        {
            name: 'Jupiter',
            texture: '/jupiter.jpg',
            size: 2,
            distance: 30,
            info: 'Jupiter is the largest planet in the Solar System. It has over 79 moons and features a giant storm known as the Great Red Spot.',
            orbitColor: 0xffa500
        },
        {
            name: 'Saturn',
            texture: '/saturn.jpg',
            size: 1.8,
            distance: 35,
            info: 'Saturn is famous for its stunning ring system made of ice and rock. It has 83 moons, including the large moon Titan.',
            orbitColor: 0xffd700
        },
        {
            name: 'Uranus',
            texture: '/uranus.jpg',
            size: 0.8,
            distance: 40,
            info: 'Uranus is a blue-green planet due to methane in its atmosphere. It rotates on its side, making its axis nearly horizontal.',
            orbitColor: 0x00ffff
        },
        {
            name: 'Neptune',
            texture: '/neptune.jpg',
            size: 0.8,
            distance: 45,
            info: 'Neptune, the farthest planet from the Sun, has the fastest winds in the Solar System, reaching speeds of over 2,100 km/h.',
            orbitColor: 0x4682b4
        },
    ];

    return planetData;
}