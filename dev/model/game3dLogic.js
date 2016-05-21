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
					emit(io, TASKS[i].socket_id, 'skill cooldown', {
						id: TASKS[i].socket_id,
						skill_id: TASKS[i].skill_id,
						time: parseInt(timeLeft / 1000)
					});
					break;

				case 'skillAnimate':
					// calc time passed
					var timePassed = parseInt(new Date().getTime() - TASKS[i].useTime);

					if(timePassed >= TASKS[i].active_time)
					{
						// send skill animate to socket
						io.sockets.connected[TASKS[i].socket_id].emit('skill animate', {
							id: TASKS[i].socket_id,
							skill_id: TASKS[i].skill_id,
							sound: TASKS[i].soundAction,
							action: 'end'
						});

						// remove task
						TASKS.splice(i, 1);
						continue;
					}

					// calc distance
					var distance = timePassed * TASKS[i].move_step_by_millisecond;

					// calc position
				    var Rab = Math.sqrt(Math.pow((TASKS[i].end_point.world_x - TASKS[i].start_point.x), 2)  + Math.pow((TASKS[i].end_point.world_z - TASKS[i].start_point.z), 2));
				    var k = distance / Rab;

				    // new position
				    var positionEnd = {
					    world_x: TASKS[i].start_point.x + (TASKS[i].end_point.world_x - TASKS[i].start_point.x) * k,
						world_y: -230,
						world_z: TASKS[i].start_point.z + (TASKS[i].end_point.world_z - TASKS[i].start_point.z) * k
					}

					if(typeof TASKS[i].positionLast == 'undefined')
					{
						TASKS[i].positionLast = {
							world_x: TASKS[i].start_point.x,
							world_y: -230,
							world_z: TASKS[i].start_point.z
						};
					}

					// check collision with opponents
					var collision = checkCollisionWithPlayers({
						x: positionEnd.world_x,
						y: positionEnd.world_y,
						z: positionEnd.world_z
					}, core.getPlayerBySocketId(TASKS[i].socket_id).character.user_id);

					if(collision.length > 0)
					{
						// stop skill animate
						TASKS[i].useTime -= 9999999;
						TASKS[i].soundAction = 'collision';
						continue;
					}

					// send skill animate to socket
					io.sockets.connected[TASKS[i].socket_id].emit('skill animate', {
						id: TASKS[i].socket_id,
						skill_id: TASKS[i].skill_id,
						action: 'animate',
						positionLast: TASKS[i].positionLast,
						positionEnd: positionEnd,
						speed: 35
					});

					// save last point
					TASKS[i].positionLast = positionEnd;
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
	switch(parseInt(data.id))
	{
		case 1:
			// distance skill
			console.log('use distance skill, id:', data.id);
			useSkillDistance(socket, player, skillIndex, data);
			break;
		default:
			console.log('> use undefined skill, id', data.id);
			return false;
	}
}

function useSkillDistance(socket, player, skillIndex, data)
{
	var cooldownTask,
		animateTask,
		moveStepByMillisecond = player.skills[skillIndex].distance / player.skills[skillIndex].active_time;

    // set recovering
	core.setPlayerSkillProperties(socket.id, skillIndex, 'isRecovering', true);

	// send callback
	socket.emit('use skill', {
		id: socket.id,
		endPosition: data.targetPosition
	});

	// set tasks
	cooldownTask = {
		action: 'skillCooldown',
		socket_id: socket.id,
		skill_id: player.skills[skillIndex].id,
		colldown:  player.skills[skillIndex].cooldown,
		skillIndex:  skillIndex,
		useTime: new Date().getTime()
	};
	animateTask = {
		action: 'skillAnimate',
		socket_id: socket.id,
		skill_id: player.skills[skillIndex].id,
		start_point: {
			x: player.position.x,
			y: player.position.y,
			z: player.position.z
		},
		end_point:  data.targetPosition,
		active_time:  player.skills[skillIndex].active_time,
		move_step_by_millisecond:  moveStepByMillisecond,
		useTime: new Date().getTime()
	};

	// add to loop function
    TASKS.push(cooldownTask);
    TASKS.push(animateTask);
}

function checkCollisionWithPlayers(position, exclude_id)
{
	var players = core.getPlayers(),
		collisions = [];

	Object.keys(players.PlayersData).forEach(function(user_id){
		if(user_id != exclude_id && checkDistanceBetweenPoints(position, players.PlayersData[user_id].position) <= 50)
		{
			// collision with player
			collisions.push({
				id: user_id
			});
		}
    });

    return collisions;
}

/**
 * get distance between points
 * @param  {[type]} position_1
 * @param  {[type]} position_2
 * @return {[type]}
 */
function checkDistanceBetweenPoints(position_1, position_2)
{
    return Math.sqrt(Math.pow(position_2.x - position_1.x, 2) + Math.pow(position_2.z - position_1.z, 2));
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

function emit(io, socket_id, event_name, data)
{
	if(typeof io.sockets.connected[socket_id] != 'undefined')
	{
		io.sockets.connected[socket_id].emit(event_name, data);
	}
}

function error(name, err, socket)
{
	console.log(name, err);
	socket.emit('error', err);
}