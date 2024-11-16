export function getPlanetsData(){
    const planetData = [
        {
            name: 'Mercury',
            texture: '/mercury.jpg',
            size: 0.383,
            distance: 10,
            speed: "47.36 km/s",
            radius: "2,439.7 km (0.3829 Earths)",
            siderealYear: "88 days",
            surface: "0.147 Earths",
            volume: "0.056 Earths",
            mass: "0.055 Earths",
            info: "Mercury is the first planet from the Sun and the smallest in the Solar System. In English, it is named after the ancient Roman god Mercurius (Mercury), god of commerce and communication, and the messenger of the gods. Mercury is classified as a terrestrial planet, with roughly the same surface gravity as Mars. The surface of Mercury is heavily cratered, as a result of countless impact events that have accumulated over billions of years. Its largest crater, Caloris Planitia, has a diameter of 1,550 km (960 mi), which is about one-third the diameter of the planet (4,880 km or 3,030 mi). Similarly to the Earths Moon, Mercury's surface displays an expansive rupes system generated from thrust faults and bright ray systems formed by impact event remnants.",
            orbitColor: 0xa9a9a9
        },
        {
            name: 'Venus',
            texture: '/venus.jpg',
            size: 0.949,
            distance: 15,
            speed: "35.02 km/s",
            radius: "6,051.8 km (0.9499 Earths)",
            siderealYear: "224 days",
            surface: "0.902 Earths",
            volume: "0.857 Earths",
            mass: "0.815 Earths",
            info: "Venus is the second planet from the Sun. It is a terrestrial planet and is the closest in mass and size to its orbital neighbour Earth. Venus has by far the densest atmosphere of the terrestrial planets, composed mostly of carbon dioxide with a thick, global sulfuric acid cloud cover. At the surface it has a mean temperature of 737 K (464 °C; 867 °F) and a pressure 92 times that of Earth's at sea level. These extreme conditions compress carbon dioxide into a supercritical state at Venus's surface.",
            orbitColor: 0xffe4b5
        },
        {
            name: 'Earth',
            texture: '/earth.jpg',
            size: 1,
            distance: 20,
            speed: "29.7827 km/s",
            radius: "6,371.0 km",
            siderealYear: "356 days",
            surface: "51,0072,000 km²",
            volume: "1.08321x10¹² km³",
            mass: "5,972,168×10²⁴ kg",
            info: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. This is enabled by Earth being an ocean world, the only one in the Solar System sustaining liquid surface water. Almost all of Earth's water is contained in its global ocean, covering 70.8% of Earth's crust. The remaining 29.2% of Earth's crust is land, most of which is located in the form of continental landmasses within Earth's land hemisphere. Most of Earth's land is at least somewhat humid and covered by vegetation, while large sheets of ice at Earth's polar deserts retain more water than Earth's groundwater, lakes, rivers and atmospheric water combined. Earth's crust consists of slowly moving tectonic plates, which interact to produce mountain ranges, volcanoes, and earthquakes. Earth has a liquid outer core that generates a magnetosphere capable of deflecting most of the destructive solar winds and cosmic radiation.",
            orbitColor: 0x1e90ff
        },
        {
            name: 'Mars',
            texture: '/mars.jpg',
            size: 0.532,
            distance: 25,
            speed: "24.07 km/s",
            radius: "3,396.2 km (0.533 Earths)",
            siderealYear: "687 days",
            surface: "0.284 Earths",
            volume: "0.151 Earths",
            mass: "0.107 Earths",
            info: "Mars is the fourth planet from the Sun. The surface of Mars is orange-red because it is covered in iron(III) oxide dust, giving it the nickname 'the Red Planet'. Mars is among the brightest objects in Earth's sky, and its high-contrast albedo features have made it a common subject for telescope viewing. It is classified as a terrestrial planet and is the second smallest of the Solar System's planets with a diameter of 6,779 km (4,212 mi). In terms of orbital motion, a Martian solar day (sol) is equal to 24.5 hours, and a Martian solar year is equal to 1.88 Earth years (687 Earth days). Mars has two natural satellites that are small and irregular in shape: Phobos and Deimos.",
            orbitColor: 0xff4500
        },
        {
            name: 'Jupiter',
            texture: '/jupiter.jpg',
            size: 2,
            distance: 30,
            speed: "13.06 km/s",
            radius: "69,911 km (10.973 Earths)",
            siderealYear: "11.86 years",
            surface: "120.4 Earths",
            volume: "1,321 Earths",
            mass: "317.8 M🜨 Earths",
            info: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than 2.5 times that of all the other planets in the Solar System combined and slightly less than one-thousandth the mass of the Sun. Its diameter is eleven times that of Earth, and a tenth that of the Sun. Jupiter orbits the Sun at a distance of 5.20 AU (778.5 Gm), with an orbital period of 11.86 years. It is the third brightest natural object in the Earth's night sky, after the Moon and Venus, and has been observed since prehistoric times. Its name derives from that of Jupiter, the chief deity of ancient Roman religion.",
            orbitColor: 0xffa500
        },
        {
            name: 'Saturn',
            texture: '/saturn.jpg',
            size: 1.8,
            distance: 35,
            speed: "9.68 km/s",
            radius: "58,232 km (9.1402 Earths)",
            siderealYear: "29.45 years",
            surface: "83.703 Earths",
            volume: "763.59 Earths",
            mass: "95.159 Earths",
            info: "Saturn is the sixth planet from the Sun and the second largest in the Solar System, after Jupiter. It is a gas giant, with an average radius of about nine times that of Earth. It has an eighth the average density of Earth, but is over 95 times more massive. Even though Saturn is almost as big as Jupiter, Saturn has less than a third the mass of Jupiter. Saturn orbits the Sun at a distance of 9.59 AU (1,434 million km), with an orbital period of 29.45 years.",
            orbitColor: 0xffd700
        },
        {
            name: 'Uranus',
            texture: '/uranus.jpg',
            size: 0.8,
            distance: 40,
            speed: "6.80 km/s",
            radius: "25,559 km (4.007 Earths)",
            siderealYear: "84.01 years",
            surface: "15.91 Earths",
            volume: "63.086 Earths",
            mass: "14.536 Earths",
            info: "Uranus is the seventh planet from the Sun. It is a gaseous cyan-coloured ice giant. Most of the planet is made of water, ammonia, and methane in a supercritical phase of matter, which astronomy calls 'ice' or volatiles. The planet's atmosphere has a complex layered cloud structure and has the lowest minimum temperature (49 K (−224 °C; −371 °F)) of all the Solar System's planets. It has a marked axial tilt of 82.23° with a retrograde rotation period of 17 hours and 14 minutes. This means that in an 84-Earth-year orbital period around the Sun, its poles get around 42 years of continuous sunlight, followed by 42 years of continuous darkness.",
            orbitColor: 0x00ffff
        },
        {
            name: 'Neptune',
            texture: '/neptune.jpg',
            size: 0.8,
            distance: 45,
            speed: "5.43 km/s",
            radius: "24,764 km (3.883 Earths)",
            siderealYear: "164.8 years",
            surface: "14.98 Earths",
            volume: "57.74 Earths",
            mass: "17.147 Earths",
            info: "Neptune is the eighth and farthest known planet from the Sun. It is the fourth-largest planet in the Solar System by diameter, the third-most-massive planet, and the densest giant planet. It is 17 times the mass of Earth. Compared to its fellow ice giant Uranus, Neptune is slightly more massive, but denser and smaller. Being composed primarily of gases and liquids,[21] it has no well-defined solid surface, and orbits the Sun once every 164.8 years at an orbital distance of 30.1 astronomical units (4.5 billion kilometres; 2.8 billion miles). It is named after the Roman god of the sea and has the astronomical symbol ♆, representing Neptune's trident.",
            orbitColor: 0x4682b4
        },
    ];

    return planetData;
}