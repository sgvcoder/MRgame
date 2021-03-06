// app/models/game.js
'use strict';

module.exports = {
	getCharacter: getCharacter,
	createCharacter: createCharacter,
	action: action,
	getRoomById: getRoomById,
	getPlayers: getPlayers,
	getPlayerBySocketId: getPlayerBySocketId,
	getSocketIdByUserId: getSocketIdByUserId,
	setPlayerProperties: setPlayerProperties,
	setPlayerSkillProperties: setPlayerSkillProperties,
	checkCollisionWithPlayers: checkCollisionWithPlayers,
	checkCollisionWithBots: checkCollisionWithBots
};

// load up the game model
var mysql = require('mysql'),
	dbconfig = require('../config/database'),
	cookie = require('cookie'),
	ejs = require('ejs'),
	fs = require('fs');

// database init
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

var ROOMS = {
		room_id: {
			bots: {}
		}
	},
	PlayersData = {},
	PlayersSocketToId = {},
	skills_tree = {
		branches: []
	};

function getRoomById(room_id)
{
	return ROOMS[room_id];
}


function getPlayers()
{
	return {
		PlayersData: PlayersData,
		PlayersSocketToId: PlayersSocketToId
	};
}

function getPlayerBySocketId(socket_id)
{
	return PlayersData[PlayersSocketToId[socket_id]];
}

function setPlayerProperties(socket_id, param, value)
{
	var pr = param.split(".");
	if(pr.length == 1)
	{
		PlayersData[PlayersSocketToId[socket_id]][pr[0]] = value;
	}
	else if(pr.length == 2)
	{
		PlayersData[PlayersSocketToId[socket_id]][pr[0]][pr[1]] = value;
	}
	else if(pr.length == 3)
	{
		PlayersData[PlayersSocketToId[socket_id]][pr[0]][pr[1]][pr[2]] = value;
	}
}

function setPlayerSkillProperties(socket_id, skillIndex, param, value)
{
	PlayersData[PlayersSocketToId[socket_id]].skills[skillIndex][param] = value;
}

// load all skills info
loadSkillsTree();

function loadSkillsTree()
{
	var sortedSkills = {},
		sql = 'SELECT * FROM skills;';

	connection.query(sql, [], function(err, rows){
	    if(err)
	    {
		    error('game3d->loadSkillsTree', err);
		    return;
	    }

	    // sorting by branch name
	    for (var i = 0; i < rows.length; i++)
	    {
	    	if(typeof sortedSkills[rows[i].branch] == 'undefined')
	    	{
	    		// init branch
	    		sortedSkills[rows[i].branch] = []
	    	}

	    	// add skill to branch
	    	sortedSkills[rows[i].branch].push(rows[i]);
	    }

	    // formatting skills tree
	    Object.keys(sortedSkills).forEach(function(branch_name){
	    	var branch = {
				name: branch_name,
				skills: []
			};

	    	for (var i = 0; i < sortedSkills[branch_name].length; i++)
		    {
		    	var skill = sortedSkills[branch_name][i];
		    	// add more params
				skill.status = 'available';
				skill.statusClass = 'available';

		    	// add skill to branch
		    	branch.skills.push(skill);
		    }

		    skills_tree.branches.push(branch);
	    });
	});
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
		case 'connection':
			playerInit(socket);
			break;
		case 'user_disconnect':
			playerDisconnect(socket.id);
			break;
		case 'player_start_find_1x1':
			playerStartFind_1x1(io, socket);
			break;
		case 'player_cancel_find_1x1':
			playerCancelFind_1x1(io, socket);
			break;
		case 'player_confirmed_game_1x1':
			playerConfirmedGame_1x1(io, socket);
			break;
		case 'skills_load_tree_for_player':
			skillsLoadTreeForPlayer(socket);
			break;
		case 'skills_change_status_for_player':
			skillsChangeStatusForPlayer(socket, data.data);
			break;
		case 'skills_apply_for_player':
			skillsApplyForPlayer(socket, data.activeSkills);
			break;
		default: console.log('undefined socket data', data);
	}
}

function playerInit(socket)
{
	var client_cookie,
		sql;

	// get cookie
	client_cookie = cookie.parse(socket.request.headers.cookie);

	// get user with character by ssession
	sql = "SELECT U.id AS user_id, C.*";
	sql += " FROM users AS U";
	sql += " LEFT JOIN users_to_characters AS UTC";
	sql += " ON UTC.user_id = U.id";
	sql += " LEFT JOIN characters AS C";
	sql += " ON C.id = UTC.character_id";
	sql += " WHERE 1=1";
	sql += " AND U.session_id = ?";

	connection.query(sql, [client_cookie['express.id']], function(err, rows){
	    if(rows.length == 0 || err)
	    {
		    error('game3d->playerInit', err, socket);
		    return;
	    }

	    if(typeof PlayersData[rows[0].user_id] == 'undefined')
	    {
		    // create player
			PlayersData[rows[0].user_id] = {
				status: 'available',
				character: rows[0],
				maxActiveSkills: 3,
				name: socket.id
			};
		}

	    // skills init
	    playerSkillsInit(socket, rows[0]);

		// link socket id to user id
		PlayersSocketToId[socket.id] = rows[0].user_id;
	});
}

function playerSkillsInit(socket, user, isUpdate)
{
	// get skills
    var sql = "SELECT S.*";
	sql += " FROM skills_to_users AS STU";
	sql += " LEFT JOIN skills AS S";
	sql += " ON S.id = STU.skill_id";
	sql += " WHERE 1=1";
	sql += " AND STU.user_id = ?";

	var skill = [];

	connection.query(sql, [user.user_id], function(err, rows){
	    if(err)
	    {
		    error('game3d->playerSkillsInit', err, socket);
		    return;
	    }

		// add new skill to user object
		PlayersData[user.user_id].skills = [];
		for (var i = 0; i < rows.length; i++)
		{
			skill = rows[i];
			skill.isRecovering = false;
			PlayersData[user.user_id].skills.push(skill);
		}

		if(isUpdate == true)
		{
			console.log('> upgrade skills of user', user.user_id);

			// update user interface
			getCharacter(socket);
		}
		else
		{
			console.log('> new user', user.user_id);

			// send notify
			socket.emit('player ready');
		}

	});
}

function playerDisconnect(socket_id)
{
	// remove player info
	// delete(PlayersData[PlayersSocketToId[socket_id]]);

	// delete socket from link socket to user id
	delete(PlayersSocketToId[socket_id]);
}

function playerStartFind_1x1(io, socket)
{
	socket.join('find game 1x1');
	socket.emit('find game started');

	// set status
	PlayersData[PlayersSocketToId[socket.id]].status = 'waiting';

	var waitingPlayers = [],
		socket_id;

	Object.keys(PlayersData).forEach(function(user_id){

		socket_id = getSocketIdByUserId(user_id);

        if(typeof PlayersData[user_id] == 'object')
        {
        	if (io.sockets.connected[socket_id] && PlayersData[user_id].status == 'waiting')
        	{
        		if(waitingPlayers.length < 2)
        		{
        			waitingPlayers.push(socket_id);
        		}
			}
        }
    });

	if(waitingPlayers.length >= 2)
	{
	    // send invites
	    for(var i = 0; i < 2; i++)
	    {
	    	PlayersData[PlayersSocketToId[waitingPlayers[i]]].status = 'starting';
		    io.sockets.connected[waitingPlayers[i]].emit('find game 1x1 - confirm');
		    console.log('send confirm to ', waitingPlayers[i]);
	    }
	}
}

function playerCancelFind_1x1(io, socket)
{
	// get rooms of socket
	var rooms = io.sockets.adapter.sids[socket.id],
		socketsRoom,
		user_id;

	Object.keys(rooms).forEach(function(key){
        if(key == 'find game 1x1')
        {
        	// get sockets of room
			socketsRoom = io.sockets.adapter.rooms[key].sockets;

			Object.keys(socketsRoom).forEach(function(socketKey){
				user_id = PlayersSocketToId[socketKey];

				if(typeof PlayersData[user_id] == 'object' && (PlayersData[user_id].status == 'starting' || PlayersData[user_id].status == 'confirmed'))
				{
		        	// set status
					PlayersData[user_id].status = 'available';

					// send notify
					io.sockets.connected[socketKey].emit('canceled find game');
				}
		    });
        }
    });
}

function playerConfirmedGame_1x1(io, socket)
{
	var user_id = PlayersSocketToId[socket.id],
		socket_id,
		confirmedPlayers = [];

	if(PlayersData[user_id].status != 'starting')
		return false;

	// set status
	PlayersData[user_id].status = 'confirmed';

	Object.keys(PlayersData).forEach(function(key){
        if(typeof PlayersData[key] == 'object')
        {
        	socket_id = getSocketIdByUserId(key);

        	if (io.sockets.connected[socket_id] && PlayersData[key].status == 'confirmed')
        	{
        		if(confirmedPlayers.length < 2)
        		{
        			confirmedPlayers.push(socket_id);
        		}
			}
        }
    });

	if(confirmedPlayers.length >= 2)
	{
	    // send invites
	    for(var i = 0; i < 2; i++)
	    {
	    	PlayersData[PlayersSocketToId[confirmedPlayers[i]]].status = 'in game';
		    io.sockets.connected[confirmedPlayers[i]].emit('redirect', {
		    	url: '/3dscene'
		    });
		    console.log('in game ', confirmedPlayers[i]);
	    }
	}
}

function getSocketIdByUserId(user_id)
{
	var socket_id = 'undefined';

	Object.keys(PlayersSocketToId).forEach(function(key){
		if(PlayersSocketToId[key] == user_id)
		{
			socket_id = key;
		}
	});

	return socket_id;
}

function skillsLoadTreeForPlayer(socket)
{
	// users skill
	var user_active_skils = PlayersData[PlayersSocketToId[socket.id]].skills;

	// clone skills tree
	var users_skills_tree = (JSON.parse(JSON.stringify(skills_tree)));

	// set count activated
	users_skills_tree.countActivated = 0;

	if(user_active_skils.length > 0)
	{
		// modify tree for user
		for (var b = 0; b < users_skills_tree.branches.length; b++)
		{
			// branche
			for (var s = 0; s < users_skills_tree.branches[b].skills.length; s++)
			{
				// skill

				for (var us = 0; us < user_active_skils.length; us++)
				{
					// set checked if user has skill
					if(user_active_skils[us].id == users_skills_tree.branches[b].skills[s].id)
					{
						users_skills_tree.branches[b].skills[s].statusClass += ' active';
						users_skills_tree.countActivated++;
					}
				}
			}
		}
	}

	// send to client
	socket.emit('skills tree', {
		tree: users_skills_tree
	});
}

function skillsChangeStatusForPlayer(socket, data)
{
	if(data.status == 'enabled')
	{
		socket.emit('skills new status', {
			skill_id: data.skill_id,
			status: 'enabled'
		});
	}

	if(data.status == 'disabled')
	{
		socket.emit('skills new status', {
			skill_id: data.skill_id,
			status: 'disabled'
		});
	}
}

function skillsApplyForPlayer(socket, activeSkills)
{
	var user_id = PlayersSocketToId[socket.id];

	// remove links skills to user from DB
    var sql = "DELETE FROM skills_to_users WHERE user_id = ?";
	connection.query(sql, [user_id], function(err, rows){
	    if(err)
	    {
		    error('game3d->skillsApplyForPlayer:remove links skills to user', err, socket);
		    return;
	    }

	    if(activeSkills.length > 0)
	    {
	    	// link skill to user
	    	for (var i = 0; i < activeSkills.length; i++)
	    	{
	    		if(i < PlayersData[PlayersSocketToId[socket.id]].maxActiveSkills)
	    		{
		    		sql = 'INSERT INTO skills_to_users (`user_id`, `skill_id`) VALUES (?, ?)';
		    		connection.query(sql, [user_id, activeSkills[i]]);
	    		}
	    	}
	    }

	    playerSkillsInit(socket, {
	    	user_id: user_id
	    }, true);
	});
}

function isSkillAvailableForPlayer(user_id, skill_id)
{
	return true;
}

function getCharacter(socket)
{
	var data = PlayersData[PlayersSocketToId[socket.id]];
	socket.emit('character info', data);
}

function createCharacter(io, socket, data)
{
	// get user id by socket id
	var user_id = PlayersSocketToId[socket.id];

	// create character
    var query = "INSERT INTO users_to_characters (character_id, user_id) VALUES (?, ?);",
    	character_id = data.id;

    connection.query(query,[character_id, user_id], function(err, rows){
    	if(err)
    	{
	    	error('game3d->createCharacter', err, socket);
	    	return;
    	}

    	socket.emit('reload page', true);
    });
}

function checkCollisionWithPlayers(position, exclude_id)
{
	var collisions = [];

	Object.keys(PlayersData).forEach(function(user_id){
		if(user_id != exclude_id && checkDistanceBetweenPoints(position, PlayersData[user_id].position) <= 10)
		{
			// collision with player
			collisions.push({
				id: user_id
			});
		}
    });

    return collisions;
}

function checkCollisionWithBots(position, room_id)
{
	var bots = getRoomById(room_id).bots;
	var collisions = [];

	Object.keys(bots).forEach(function(i){
		if(checkDistanceBetweenPoints(position, bots[i].position) <= 50)
		{
			// collision with player
			collisions.push({
				id: i
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

function randomIntInc()
{
	var number = Math.random() + '';
	return number.substring(2, number.length);
}

function error(name, err, socket)
{
	console.log(name, err);
	socket.emit('error', err);
}