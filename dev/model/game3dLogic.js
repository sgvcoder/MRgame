// app/models/game3dLogic.js
'use strict';

module.exports = {
	action: action,
	loopGameActionsInit: loopGameActionsInit
};

var config = require('../config/game3d.js');

var mysql = require('mysql'),
	dbconfig = require('../config/database'),
	cookie = require('cookie'),
	ejs = require('ejs'),
	fs = require('fs'),
	astar = require('./astar.js'),
	core = require('./game3d.js');

// database init
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

/**
 * render actions. ~28 FPS
 * @param  {object} io
 * @return {void}
 */
function loopGameActionsInit(io)
{
	console.log('\n>>>>> loopGameActionsInit <<<<<\n');

	var loopGameActions = setInterval(function(){

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

function eventsInit(io, socket)
{
	/**
	 * load configs
	 */
	socket.on('get map data', function(){
		core.setPlayerProperties(socket.id, 'position', {x: 0, y: config.scene.floor.position.y, z: 0});
		core.setPlayerProperties(socket.id, 'moveSpeed', 200);
		core.setPlayerProperties(socket.id, 'character.model', 'threeObjects/butterfly_low.js');

		// send data to user
		socket.emit('map data', {
			config: config.scene,
			audioFiles: config.audioFiles,
			player: core.getPlayerBySocketId(socket.id),
			decor: config.decorList
		});
	});

	/**
	 * click on object
	 */
	socket.on('click on object', function(object){
		switch(object.name)
		{
			case 'Floor':
				sceneMovePlayer(socket, object);
				break;
			default: return;
		}
		console.log('click on:', object.name, socket.id);
	});
}

function sceneMovePlayer(socket, targetData)
{
	var player = core.getPlayerBySocketId(socket.id);

	// convert world position to local position by floor
    var local_x = parseInt(player.position.x + (config.scene.floor.width / 2)),
        local_z = parseInt(player.position.z + (config.scene.floor.length / 2));

    // get coordinates on matrix
    var move_from = getMapClickPosition(local_x, local_z),
        move_to = getMapClickPosition(targetData.mouse_pos.x, targetData.mouse_pos.z);

    // get move path
    var graph = new astar.graph(config.scene.map.matrix, {
        diagonal: true
    });

    var start = graph.grid[move_from.row][move_from.column],
        end = graph.grid[move_to.row][move_to.column],
        path = astar.core().search(graph, start, end, {
            heuristic: astar.core().heuristics.diagonal
        });

    console.log(path);
}

function getMapClickPosition(pixel_x, pixel_z)
{
    return {
        column: parseInt((pixel_x / config.scene.floor.width) * config.scene.map.matrix[0].length),
        row: parseInt((pixel_z / config.scene.floor.length) * config.scene.map.matrix.length)
    };
}

function error(name, err, socket)
{
	console.log(name, err);
	socket.emit('error', err);
}