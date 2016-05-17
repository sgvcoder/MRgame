// app/models/game3dLogic.js
'use strict';

module.exports = {
	action: action,
	loopGameActionsInit: loopGameActionsInit
};

// load up the game model
var mysql = require('mysql'),
	dbconfig = require('../config/database'),
	cookie = require('cookie'),
	ejs = require('ejs'),
	fs = require('fs'),
	core = require('./game3d.js');

// database init
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

/**
 * render actions of players. ~28 FPS
 * @param  {object} io
 * @return {void}
 */
function loopGameActionsInit(io)
{
	console.log('\n>>>>> loopGameActionsInit <<<<<\n');

	var loopGameActions = setInterval(function() {

	}, 35);
}

/**
 * Main game actions
 * @param  {object} io
 * @param  {object} socket [current socket]
 * @param  {object} data [name of game action]
 * @return {void}
 */
function action(io, socket, data)
{
	switch(data.action)
	{
		case 'eventsInit':
			eventsInit(io, socket);
			break;
		default: console.log('undefined socket data', data);
	}
}

var config = {
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
};

var audioFiles = {
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
};

function eventsInit(io, socket)
{
	socket.on('get map data', function(){
		console.log('send map data');
		socket.emit('map data', {
			config: config,
			audioFiles: audioFiles,
			player: core.getPlayerBySocketId(socket.id)
		});

	});
}

function error(name, err, socket)
{
	console.log(name, err);
	socket.emit('error', err);
}