// app/models/skills.js
'use strict';

module.exports = {
	cooldown: cooldown,
	animate: animate
};

// load map config
var config = require('../config/game3d.js');

var core = require('./game3d.js');

function cooldown(io, task)
{
	// calc time left
	var timeLeft = parseInt(task.colldown - (new Date().getTime() - task.useTime));

	if(timeLeft < 0)
	{
		// send skill cooldown to socket
		io.sockets.connected[task.socket_id].emit('skill cooldown', {
			id: task.socket_id,
			skill_id: task.skill_id,
			time: -1
		});

		// set recovering
		core.setPlayerSkillProperties(task.socket_id, task.skillIndex, 'isRecovering', false);

		// remove task
		return {
			new_status: 'remove'
		};
	}

	// send skill cooldown to socket
	emit(io, task.socket_id, 'skill cooldown', {
		id: task.socket_id,
		skill_id: task.skill_id,
		time: parseInt(timeLeft / 1000)
	});

	return {
		new_status: 'continue'
	};
}

function animate(io, task)
{
	// calc time passed
	var timePassed = parseInt(new Date().getTime() - task.useTime);

	if(timePassed >= task.active_time)
	{
		// send skill animate to socket
		io.sockets.connected[task.socket_id].emit('skill animate', {
			id: task.socket_id,
			skill_id: task.skill_id,
			sound: task.soundAction,
			action: 'end'
		});

		// remove task
		return {
			new_status: 'remove'
		};
	}

	// calc distance
	var distance = timePassed * task.move_step_by_millisecond;

	// calc position
    var Rab = Math.sqrt(Math.pow((task.end_point.world_x - task.start_point.x), 2)  + Math.pow((task.end_point.world_z - task.start_point.z), 2));
    var k = distance / Rab;

    // new position
    var positionEnd = {
	    world_x: task.start_point.x + (task.end_point.world_x - task.start_point.x) * k,
		world_y: -245,
		world_z: task.start_point.z + (task.end_point.world_z - task.start_point.z) * k
	}

	if(typeof task.positionLast == 'undefined')
	{
		task.positionLast = {
			world_x: task.start_point.x,
			world_y: -245,
			world_z: task.start_point.z
		};
	}

	// check collision with opponents
	var collision = core.checkCollisionWithPlayers({
		x: positionEnd.world_x,
		y: positionEnd.world_y,
		z: positionEnd.world_z
	}, core.getPlayerBySocketId(task.socket_id).character.user_id);

	if(collision.length > 0)
	{
		console.log('collision', collision);

		// stop skill animate
		task.useTime -= 9999999;
		task.soundAction = 'collision';
		return {
			new_status: 'collision',
			collision: collision,
			isBot: false
		};
	}

	var collisionBot = core.checkCollisionWithBots({
		x: positionEnd.world_x,
		y: positionEnd.world_y,
		z: positionEnd.world_z
	}, 'room_id');

	if(collisionBot.length > 0)
	{
		console.log('collisionBot', collisionBot);

		// stop skill animate
		task.useTime -= 9999999;
		task.soundAction = 'collisionBot';
		return {
			new_status: 'collision',
			collision: collisionBot,
			isBot: true
		};
	}

	// send skill animate to socket
	io.sockets.connected[task.socket_id].emit('skill animate', {
		id: task.socket_id,
		skill_id: task.skill_id,
		action: 'animate',
		positionLast: task.positionLast,
		positionEnd: positionEnd,
		speed: config.system.updateRate
	});

	// save last point
	task.positionLast = positionEnd;

	return {
		new_status: 'continue'
	};
}

function emit(io, socket_id, event_name, data)
{
	if(typeof io.sockets.connected[socket_id] != 'undefined')
	{
		io.sockets.connected[socket_id].emit(event_name, data);
	}
}