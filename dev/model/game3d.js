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

var PlayersData = {};

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
		case 'connection':
			playerConnection(socket.id);
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
		default: console.log('undefined socket data', data);
	}
}

function playerConnection(socket_id)
{
	PlayersData[socket_id] = {
		status: 'available'
	};
}

function playerDisconnect(socket_id)
{
	delete(PlayersData[socket_id]);
}

function playerStartFind_1x1(io, socket)
{
	socket.join('find game 1x1');
	socket.emit('find game started');

	// set status
	PlayersData[socket.id].status = 'waiting';

	var waitingPlayers = [];

	Object.keys(PlayersData).forEach(function(key){
        if(typeof PlayersData[key] == 'object')
        {
        	if (io.sockets.connected[key] && PlayersData[key].status == 'waiting')
        	{
        		if(waitingPlayers.length < 2)
        		{
        			waitingPlayers.push(key);
        		}
			}
        }
    });

	if(waitingPlayers.length >= 2)
	{
	    // send invites
	    for(var i = 0; i < 2; i++)
	    {
	    	PlayersData[waitingPlayers[i]].status = 'starting';
		    io.sockets.connected[waitingPlayers[i]].emit('find game 1x1 - confirm');
		    console.log('send confirm to ', waitingPlayers[i]);
	    }
	}
}

function playerCancelFind_1x1(io, socket)
{
	// get rooms of socket
	var rooms = io.sockets.adapter.sids[socket.id];

	Object.keys(rooms).forEach(function(key){
        if(key == 'find game 1x1')
        {
        	// get sockets of room
			var socketsRoom = io.sockets.adapter.rooms[key].sockets;

			Object.keys(socketsRoom).forEach(function(socketKey){
				if(typeof PlayersData[socketKey] == 'object' && (PlayersData[socketKey].status == 'starting' || PlayersData[socketKey].status == 'confirmed'))
				{
		        	// set status
					PlayersData[socketKey].status = 'available';

					// send notify
					io.sockets.connected[socketKey].emit('canceled find game');
				}
		    });
        }
    });
}

function playerConfirmedGame_1x1(io, socket)
{
	if(PlayersData[socket.id].status != 'starting')
		return false;

	// set status
	PlayersData[socket.id].status = 'confirmed';

	var confirmedPlayers = [];

	Object.keys(PlayersData).forEach(function(key){
        if(typeof PlayersData[key] == 'object')
        {
        	if (io.sockets.connected[key] && PlayersData[key].status == 'confirmed')
        	{
        		if(confirmedPlayers.length < 2)
        		{
        			confirmedPlayers.push(key);
        		}
			}
        }
    });

	if(confirmedPlayers.length >= 2)
	{
	    // send invites
	    for(var i = 0; i < 2; i++)
	    {
	    	PlayersData[confirmedPlayers[i]].status = 'in game';
		    io.sockets.connected[confirmedPlayers[i]].emit('redirect', {
		    	url: '/3dscene'
		    });
		    console.log('in game ', confirmedPlayers[i]);
	    }
	}
}

function getCharacter(io, socket)
{
	// get cookie
	var client_cookie = cookie.parse(socket.request.headers.cookie);

	connection.query("SELECT * FROM users WHERE session_id = ?", [client_cookie['express.id']], function(err, rows){
	    if(err)
		    error('game3d->getCharacter:error', err, socket);

	    if(rows.length == 0 || err)
	    	return;

	    var user = rows[0],
	    	user_name = user.username.split('@');

    	connection.query("SELECT C.* FROM characters AS C WHERE C.user_id = ?;", [user.id], function(err, rows){
		    if(err)
			    error('game3d->getCharacter:2:error', err, socket);

		    if(rows.length == 0 || err)
		    	return;

		    rows[0].name = user_name[0];

		   	socket.emit('character info', rows[0]);
		});
	});
}

function createCharacter(io, socket, data)
{
	// get cookie
	var client_cookie = cookie.parse(socket.request.headers.cookie);

	connection.query("SELECT * FROM users WHERE session_id = ?", [client_cookie['express.id']], function(err, rows){
	    if(err)
		    error('game3d->createCharacter:error', err, socket);

	    if(rows.length == 0 || err)
	    	return;

		// create room
	    var query = "INSERT INTO characters (type_id, user_id) VALUES (?, ?);",
	    	type_id = 1;
	    connection.query(query,[type_id, rows[0].id], function(err, rows){
	    	if(err)
	    	{
		    	error('game3d->createCharacter:2:error', err, socket);
		    	return;
	    	}

	    	socket.emit('reload page', true);
	    });
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