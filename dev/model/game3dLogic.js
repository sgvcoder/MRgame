// app/models/game3dLogic.js
'use strict';

module.exports = {
	action: action,
	loopGameActionsInit: loopGameActionsInit
};

// load map config
var config = require('../config/game3d.js');

var astar = require('./astar.js'),
	core = require('./game3d.js');

// init loop tasks
var TASKS = [];

// calc length of cell
var cellLength = parseInt(config.scene.floor.width / config.scene.map.matrix.length);

/**
 * render actions. ~28 FPS
 * @param  {object} io
 * @return {void}
 */
var removeIdex;
function loopGameActionsInit(io)
{
	console.log('\n>>>>> loopGameActionsInit <<<<<\n');

	var loopGameActions = setInterval(function(){
		for (var i = 0; i < TASKS.length; i++)
		{
			switch(TASKS[i].action)
			{
				case 'move':
					if(TASKS[i].path.length == 0)
					{
						// remove task if steps out
					    TASKS.splice(i, 1);
						continue;
					}

					// set postition to user
					core.setPlayerProperties(TASKS[i].socket_id, 'position.x', TASKS[i].path[0].x);
					core.setPlayerProperties(TASKS[i].socket_id, 'position.y', TASKS[i].path[0].y);
					core.setPlayerProperties(TASKS[i].socket_id, 'position.z', TASKS[i].path[0].z);

					// send position to socket
					io.sockets.connected[TASKS[i].socket_id].emit('new player data', {
						id: TASKS[i].socket_id,
						animateAction: (TASKS[i].path.length <= 1) ? 'stay' : 'move',
						speed: 35,
						position: {x: TASKS[i].path[0].x, y: TASKS[i].path[0].y, z: TASKS[i].path[0].z}
					});

					// remove curent position
				    TASKS[i].path.splice(0, 1);
					break;

				case 'skillCooldown':
					// calc time left
					var timeLeft = parseInt(TASKS[i].colldown - (new Date().getTime() - TASKS[i].useTime));

					if(timeLeft < 0)
					{
						// send skill cooldown to socket
						io.sockets.connected[TASKS[i].socket_id].emit('skill cooldown', {
							id: TASKS[i].socket_id,
							skill_id: TASKS[i].skill_id,
							time: -1
						});

						// set recovering
						core.setPlayerSkillProperties(TASKS[i].socket_id, TASKS[i].skillIndex, 'isRecovering', false);

						// remove task
						TASKS.splice(i, 1);
						continue;
					}

					// send skill cooldown to socket
					io.sockets.connected[TASKS[i].socket_id].emit('skill cooldown', {
						id: TASKS[i].socket_id,
						skill_id: TASKS[i].skill_id,
						time: parseInt(timeLeft / 1000)
					});
					break;

				default: console.log('*** loop action "' + TASKS[i].action + '" not found!');
			}
		}

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
		var player = core.getPlayerBySocketId(socket.id);
		if(typeof player.position == 'undefined')
		{
			core.setPlayerProperties(socket.id, 'position', {x: 0, y: config.scene.floor.position.y, z: 0});
			core.setPlayerProperties(socket.id, 'moveSpeed', config.player.defaultSpeed);
			core.setPlayerProperties(socket.id, 'character.model', 'threeObjects/butterfly_low.js');
		}

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

	/**
	 * use skill
	 */
	socket.on('use skill', function(data){
		// get player
		var player = core.getPlayerBySocketId(socket.id);

		// find skill
		for(var i = 0; i < player.skills.length; i++)
		{
			if(player.skills[i].id == data.id)
			{
				// check cooldown
				if(player.skills[i].isRecovering == false)
				{
					// use skill
					sceneUseSkill(socket, player, i, data);
				}
				break;
			}
		}
	});
}

function sceneMovePlayer(socket, targetData)
{
	var player = core.getPlayerBySocketId(socket.id),
		moveTask = {
			action: 'move',
			socket_id: socket.id,
			path: []
		};

	// convert world position to local position by floor
    var local_x = parseInt(player.position.x + (config.scene.floor.width / 2)),
        local_z = parseInt(player.position.z + (config.scene.floor.length / 2));

    // get coordinates on matrix
    var move_from = getMapClickPosition(local_x, local_z),
        move_to = getMapClickPosition(targetData.mouse_pos.x, targetData.mouse_pos.z);

    // get move path
    var graph = new astar.graph(config.scene.map.matrix, {
	        diagonal: true
	    }),
    	start = graph.grid[move_from.row][move_from.column],
        end = graph.grid[move_to.row][move_to.column],
        path = astar.core().search(graph, start, end, {
            heuristic: astar.core().heuristics.diagonal
        });

    // create steps
    var localCoordinates;
    for(var i = 0; i < path.length; i++)
    {
    	localCoordinates = getMapPositionToPixels(path[i].x, path[i].y);
    	moveTask.path.push({
    		x: localCoordinates.x,
    		y: player.position.y,
    		z: localCoordinates.z
    	});
    }

    // add to loop function
    TASKS.push(moveTask);
}

function sceneUseSkill(socket, player, skillIndex, data)
{
	var endPosition = player.position,
		cooldownTask;

	switch(parseInt(data.id))
	{
		case 1:
			// distance skill
			console.log('use distance skill, id:', data.id);
			endPosition = useSkillDistance(player, skillIndex, data);
			break;
		default:
			console.log('> use undefined skill, id', data.id);
			return false;
	}

	// set recovering
	core.setPlayerSkillProperties(socket.id, skillIndex, 'isRecovering', true);

	// send callback
	socket.emit('use skill', {
		id: socket.id,
		startPosition: player.position,
		endPosition: endPosition
	});

	// set task
	cooldownTask = {
		action: 'skillCooldown',
		socket_id: socket.id,
		skill_id: player.skills[skillIndex].id,
		colldown:  player.skills[skillIndex].cooldown,
		skillIndex:  skillIndex,
		useTime: new Date().getTime()
	};

	// add to loop function
    TASKS.push(cooldownTask);
}

function useSkillDistance(player, skillIndex, data)
{
	// calc end position
    var Rab = Math.sqrt(Math.pow((data.targetPosition.world_x - player.position.x), 2)  + Math.pow((data.targetPosition.world_z - player.position.z), 2));
    var k = player.skills[skillIndex].distance / Rab;
    data.targetPosition.world_x = player.position.x + (data.targetPosition.world_x - player.position.x) * k;
    data.targetPosition.world_z = player.position.z + (data.targetPosition.world_z - player.position.z) * k;

    return {
    	world_x: data.targetPosition.world_x,
    	world_z: data.targetPosition.world_z
    };
}

/**
 * conver local pixels to matrix positino
 * @param  {[type]} local x
 * @param  {[type]} local z
 * @return {[type]}
 */
function getMapClickPosition(pixel_x, pixel_z)
{
    return {
        column: parseInt((pixel_x / config.scene.floor.width) * config.scene.map.matrix[0].length),
        row: parseInt((pixel_z / config.scene.floor.length) * config.scene.map.matrix.length)
    };
}

/**
 * conver matrix position to local pixels
 * @param  {[type]} row
 * @param  {[type]} column
 * @return {[type]}
 */
function getMapPositionToPixels(row, column)
{
    return {
        x: (column * (config.scene.floor.width / config.scene.map.matrix[0].length)) - config.scene.floor.width / 2,
        z: (row * ((config.scene.floor.length / config.scene.map.matrix.length)) + -(config.scene.floor.length / 2))
    };
}

function error(name, err, socket)
{
	console.log(name, err);
	socket.emit('error', err);
}