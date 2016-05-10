// app/models/socket.js
'use strict';

// load up the game model
var mysql = require('mysql'),
	dbconfig = require('../config/database'),
	cookie = require('cookie');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

function connected (io, socket)
{
	// get cookie
	var client_cookie = cookie.parse(socket.request.headers.cookie);

	// check user by express session
	connection.query("SELECT * FROM users WHERE session_id = ?", [client_cookie['express.id']], function(err, rows){
	    if(err)
	    	error('game->connected:error', err, socket);

	    if(rows.length == 0 || err)
	    	return;

    	// set new socket_id
        var query = "UPDATE users SET socket_id = ? WHERE id = ?;";
        connection.query(query,[socket.id, rows[0].id]);

        // redirect to current game through notifications to user
        if(rows[0].game_room_id)
        {
        	// get game room
    		var query = "SELECT * FROM game_rooms WHERE id = ?;";
        	connection.query(query,[rows[0].game_room_id], function(err, rows){
        		if(err)
			    	error('game->connected:error', err, socket);

			    if(rows.length == 0 || err)
			    	return;

    			socket.emit('room_id', rows[0].room_id);
        	});
        }

        console.log('a user connected: ' + socket.id);
	});
}

function disconnect(io, socket)
{
	console.log('user disconnected: ' + socket.id);
	// io.sockets.socket(socketId).emit(msg)

	// get cookie
	var client_cookie = cookie.parse(socket.request.headers.cookie);

	// check user by express session
	connection.query("SELECT * FROM users WHERE session_id = ?", [client_cookie['express.id']], function(err, rows){
	    if(err)
	    	error('game->connected:error', err, socket);

	    if(rows.length == 0 || err)
	    	return;

	    if(!rows[0].game_room_id)
	    	return;

    	// get users by group
        var query = "SELECT * FROM users WHERE game_room_id = ?;";
        connection.query(query,[rows[0].game_room_id], function(err, rows){
        	// remove room and find flag
        	for (var i = 0; i < rows.length; i++)
        	{
        		var query = "UPDATE users SET game_room_id = NULL, is_find_game = 0 WHERE id = ?;";
		        connection.query(query,[rows[i].id]);
        	}
        });
	});
}

function error(name, err, socket)
{
	console.log(name);
	console.log(err);
	socket.emit('error', err);
}

module.exports = {
	connected: connected,
	disconnect: disconnect
}

