// config/game3d.js
module.exports = {

    system: {
        updateRate: 35
    },

    scene: {
        debug: {
            enabled: true
        },
        scene: {
            fog: {
                enabled: false
            }
        },
        camera: {
            angle: 45,
            near: 0.1,
            far: 1000,
            startX: 0,
            startY: 50,
            startZ: 100,
            controls: {
                enabled: true,
                minDistance: -190,
                maxDistance: -10,
                minPolarAngle: Math.PI / 6,
                maxPolarAngle: Math.PI / 1.2,
                noKeys: true,
                noPan: true,
                noRotate: false,
                moveSpeed: 10,
                screenPadding: 0.95,
                worldSizeCube: 1165
            }
        },
        map: {
            cols: 0,
            rows: 0,
            matrix: require('../maps/demo.js'),
            showGrid: false
        },
        floor: {
            width: 3000,
            length: 3000,
            position: {
                y: -250
            }
        },
        light: {
            castShadow: true,
            frameCastShadow: false,
            power: 1500
        },
        sound: {
            maxDistance: 500
        },
        keyboard: {
        }
    },

    player: {
        defaultSpeed: 5
    },

    audioFiles: {
        skills: {
            particle: {
                start: 'sounds/effects/fishing_polecastLine_01.wav',
                collision: 'sounds/effects/clap_1.wav'
            }
        },
        move: 'sounds/effects/grass_walk_02.wav',
        music: [
            ''
        ]
    },

    decorList: [
        {
            model: 'threeObjects/woods.js',
            position: {x: -865, y: -235, z: 905},
            rotate: {x: 0.4, y: 0, z: 0},
            scale: 5,
            type: 'decor',
            objectName: 'woods'
        },{
            model: 'threeObjects/old_farm.js',
            position: {x: -50, y: -251, z: -100},
            rotate: {x: 0, y: 2, z: 0},
            scale: 3,
            type: 'decor',
            objectName: 'old_farm'
        }
    ]

};