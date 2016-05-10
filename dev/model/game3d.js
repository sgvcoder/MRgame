// app/models/game.js
'use strict';

module.exports = {
	getCharacter: getCharacter,
	createCharacter: createCharacter
};

// load up the game model
var mysql = require('mysql'),
	dbconfig = require('../config/database'),
	cookie = require('cookie'),
	ejs = require('ejs'),
	fs = require('fs');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

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