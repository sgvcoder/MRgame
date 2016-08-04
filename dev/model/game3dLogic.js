// app/models/game3dLogic.js
'use strict';

module.exports = {
	action: action,
	loopGameActionsInit: loopGameActionsInit
};

// load map config
var config = require('../config/game3d.js');

var astar = require('./astar.js'),
	core = require('./game3d.js'),
	bots = require('./game3dBots.js'),
	skills = require('./skills.js');

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
			if(typeof TASKS[i] != 'undefined')
			{
				switch(TASKS[i].action)
				{
					case 'move':
						if(TASKS[i].path.length == 0)
						{

						    if(TASKS[i].socket_id == 'bot_1')
						    {
						    	setTimeout(function(){
						    		sceneWalkBot();
						    	}, 0);
						    }

							// remove task if steps out
						    delete(TASKS[i]);
							continue;
						}

						// send position to socket
						if(TASKS[i].socket_id == 'bot_1')
						{
							var room = core.getRoomById('room_id');
							// set postition to user
							room.bots['bot_1'].position.x = TASKS[i].path[0].x;
							room.bots['bot_1'].position.y = TASKS[i].path[0].y;
							room.bots['bot_1'].position.z = TASKS[i].path[0].z;

							io.emit('new player data', {
								id: TASKS[i].socket_id,
								animateAction: (TASKS[i].path.length <= 1) ? 'stay' : 'move',
								speed: config.system.updateRate,
								position: {x: TASKS[i].path[0].x, y: TASKS[i].path[0].y, z: TASKS[i].path[0].z}
							});
						}
						else
						{
							// set postition to bot
							core.setPlayerProperties(TASKS[i].socket_id, 'position.x', TASKS[i].path[0].x);
							core.setPlayerProperties(TASKS[i].socket_id, 'position.y', TASKS[i].path[0].y);
							core.setPlayerProperties(TASKS[i].socket_id, 'position.z', TASKS[i].path[0].z);

							io.sockets.connected[TASKS[i].socket_id].emit('new player data', {
								id: TASKS[i].socket_id,
								animateAction: (TASKS[i].path.length <= 1) ? 'stay' : 'move',
								speed: config.system.updateRate,
								position: {x: TASKS[i].path[0].x, y: TASKS[i].path[0].y, z: TASKS[i].path[0].z}
							});
						}

						// remove curent position
					    TASKS[i].path.splice(0, 1);
						break;

					case 'skillCooldown':
						if(skills.cooldown(io, TASKS[i]).new_status == 'remove')
						{
							delete(TASKS[i]);
						}
						break;

					case 'skillAnimate':
						var result = skills.animate(io, TASKS[i]);
						if(result.new_status == 'remove')
						{
							delete(TASKS[i]);
						}
						else if(result.new_status == 'collision')
						{
							// set damage
							calcDamage(io, TASKS[i], result);

							delete(TASKS[i]);
						}
						break;

					default: console.log('*** loop action "' + TASKS[i].action + '" not found!');
				}
			}
		}

		for (var i = 0; i < TASKS.length; i++)
		{
			// remove empty tasks
		    if(typeof TASKS[i] == 'undefined')
		    {
		    	TASKS.splice(i, 1);
		    }
		}

	}, config.system.updateRate);
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
			core.setPlayerProperties(socket.id, 'character.health', config.player.health);
			core.setPlayerProperties(socket.id, 'character.maxHealth', config.player.health);
			core.setPlayerProperties(socket.id, 'character.energi', config.player.energi);
			core.setPlayerProperties(socket.id, 'character.maxEnergi', config.player.energi);
		}

		// send data to user
		socket.emit('map data', {
			config: config.scene,
			audioFiles: config.audioFiles,
			player: core.getPlayerBySocketId(socket.id),
			decor: config.decorList
		});

		// TEMP CALL
		setTimeout(function(bot, socket){
			var room = core.getRoomById('room_id');

			// add bot to game
			room.bots[bot.id] = bot;

			// add bot to map
			socket.emit('add bot', {
				object: bot
			});
		}, 3000, bots.getBot('bot_1'), socket);
		setTimeout(function(){
			sceneWalkBot();
		}, 10000);

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

function sceneWalkBot()
{
	var room = core.getRoomById('room_id');
	var bot = room.bots['bot_1'],
		moveTask = {
			action: 'move',
			socket_id: 'bot_1',
			path: []
		};

	// convert world position to local position by floor
    var local_x = parseInt(bot.position.x + (config.scene.floor.width / 2)),
        local_z = parseInt(bot.position.z + (config.scene.floor.length / 2));


    // get coordinates on matrix
    var move_from = getMapClickPosition(local_x, local_z),
        move_to = getMapClickPosition(1500 - (bot.startPosition.x - randomIntInc(-bot.maxWalkDistance, bot.maxWalkDistance)), 1500 - (bot.startPosition.z - randomIntInc(-bot.maxWalkDistance, bot.maxWalkDistance)));

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
    		y: bot.position.y,
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

function calcDamage(io, task, collisionData)
{
	var room = core.getRoomById('room_id'),
		player = core.getPlayerBySocketId(task.socket_id),
		activeSkill,
		target,
		newHealth;

	// get skill info
	for(var i = 0; i < player.skills.length; i++)
	{
		if(player.skills[i].id == task.skill_id)
		{
			activeSkill = player.skills[i];
			break;
		}
	}

	if(typeof activeSkill == 'undefined')
	{
		return false;
	}

	for(var i = 0; i < collisionData.collision.length; i++)
	{
		if(collisionData.isBot == true)
		{
			target = room.bots[collisionData.collision[i].id];
		}
		else
		{
			target = core.getSocketIdByUserId(collisionData.collision[i].id);
		}
	}

	newHealth = target.character.health - activeSkill.damage;
	if(newHealth < 0)
	{
		target.character.health = 0;
	}
	else
	{
		target.character.health = newHealth;
	}

	emit(io, task.socket_id, 'set health', {
		id: target.id,
		health: target.character.health
	});
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

/**
 * Returns a random integer between low (inclusive) and high (inclusive)
 */
function randomIntInc(low, high)
{
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function error(name, err, socket)
{
	console.log(name, err);
	socket.emit('error', err);
}