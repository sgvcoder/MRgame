// app/models/game.js
'use strict';

module.exports = {
	getCharacter: getCharacter,
	createCharacter: createCharacter,
	loopGameActionsInit: loopGameActionsInit,
	action: action
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

var PlayersData = {},
	PlayersSocketToId = {},
	skills_tree = {
		branches: []
	};

// load all skills info
loadSkillsTree();

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
		user,
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
		    error('game3d->playerInit:getUserСharacter', err, socket);
		    return;
	    }

	    // skills init
	    playerSkillsInit(socket, rows[0]);
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

	connection.query(sql, [user.user_id], function(err, rows){
	    if(err)
	    {
		    error('game3d->playerInit:getSkills', err, socket);
		    return;
	    }

	    // link socket id to user id
		PlayersSocketToId[socket.id] = user.user_id;

		if(typeof PlayersData[user.user_id] == 'undefined' || isUpdate == true)
		{
			// create player
			PlayersData[user.user_id] = {
				status: 'available',
				character: user,
				skills: []
			};

			for (var i = 0; i < rows.length; i++)
			{
				PlayersData[user.user_id].skills.push(rows[i]);
			}

			if(isUpdate == true)
			{
				console.log('> upgrade skills of user', user.user_id);
				getCharacter(socket);
			}
			else
			{
				console.log('> new user', user.user_id);
			}
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
	    		sql = 'INSERT INTO skills_to_users (`user_id`, `skill_id`) VALUES (?, ?)';
	    		connection.query(sql, [user_id, activeSkills[i]]);
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