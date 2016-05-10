// app/models/game.js
'use strict';

// load up the game model
var mysql = require('mysql'),
	dbconfig = require('../config/database'),
	cookie = require('cookie');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

function find(io, socket)
{
	// get cookie
	var client_cookie = cookie.parse(socket.request.headers.cookie);

	connection.query("SELECT * FROM users WHERE session_id = ?", [client_cookie['express.id']], function(err, rows){
	    if(err)
		    error('game->find:error', err, socket);

	    if(rows.length == 0 || err)
	    	return;

        var query = "UPDATE users SET is_find_game = 1 WHERE id = ?;";
        connection.query(query,[rows[0].id]);

        console.log('start find: ' + socket.id);
    	socket.emit('success', 'You start find game.');

    	find_opponent(io, socket, rows[0].id);
	});
}

function find_opponent(io, socket, owner_id)
{
	// find secondary user
	connection.query("SELECT * FROM users WHERE is_find_game = 1 AND id != ?;", [owner_id], function(err, rows){
	    if(err)
		    error('game->find_opponent:error', err, socket);

	    if(rows.length == 0 || err)
	    	return;

	    // create room
	    var room_id = randomIntInc(),
		    apponents = [owner_id, rows[0].id],
		    options = [],
		    options_json = '';

		    // generate board
		    for(var r = 0; r < 10; r++)
		    {
		    	options[r] = [];
		    	for(var c = 0; c < 10; c++)
		    	{
		    		if((r == 4 && c == 4) || (r == 5 && c == 5))
		    			options[r][c] = owner_id;
		    		else if((r == 5 && c == 4) || (r == 4 && c == 5))
		    			options[r][c] = rows[0].id;
		    		else
		    			options[r][c] = 0;
		    	}
		    }

		    options_json = JSON.stringify(options);


	    // create room
	    var query = "INSERT INTO game_rooms (room_id, options, active_user) VALUES (?, ?, ?);";
        connection.query(query,[room_id, options_json, owner_id], function(err, rows){
        	if(err)
        	{
		    	error('game->find_opponent:error', err, socket);
		    	return;
        	}

        	// get new room id
        	var record_room_id = rows.insertId;

        	// set room_id to users
		    var query = "UPDATE users SET is_find_game = 0, game_room_id = ? WHERE id IN(?);";
	        connection.query(query,[record_room_id, apponents]);
        });
	    
	    // send notifications to users
	    socket.emit('room_id', room_id);
        io.to(rows[0].socket_id).emit('room_id', room_id);
	});
}

function get_board(socket)
{
	// get cookie
	var client_cookie = cookie.parse(socket.request.headers.cookie);

	connection.query("SELECT U.id, GR.options, GR.active_user FROM users AS U, game_rooms AS GR WHERE U.session_id = ? AND U.game_room_id = GR.id", [client_cookie['express.id']], function(err, rows){
	    if(err)
		    error('game->find:error', err, socket);

	    if(rows.length == 0 || err)
	    	return;

	    var data = {};
	    data.board = rows[0].options;
	    data.user_id = rows[0].id;
	    data.active_user = rows[0].active_user;
    	socket.emit('board', data);
	});
}

function set_position(io, socket, position)
{
	// get cookie
	var client_cookie = cookie.parse(socket.request.headers.cookie);

	connection.query("SELECT U.id, GR.id AS room_id, GR.options, GR.active_user FROM users AS U, game_rooms AS GR WHERE U.session_id = ? AND U.game_room_id = GR.id", [client_cookie['express.id']], function(err, rows){
	    if(err)
		    error('game->set_position:error', err, socket);

	    if(rows.length == 0 || err)
	    	return;

		var board = JSON.parse(rows[0].options),
			room_id = rows[0].room_id,
			user_id = rows[0].id,
			is_updated = false,
			options_json = '',
			next_user_id;
		
	    // check position - is empty
		if(board[position[0]][position[1]] != 0)
		{
			socket.emit('set_position_error', 'check position - is empty');
			return;
		}

	    // check active user
		if(rows[0].active_user != rows[0].id)
		{
			socket.emit('set_position_error', 'check active user');
			return;
		}

	    // check position - is valid: check zone 3x3 around of target
	    // for(var r = (position[0] - 1); r < (position[0] + 2); r++)
	    // {
	    // 	for(var c = (position[1] - 1); c < (position[1] + 2); c++)
	    // 	{
	    // 		if(r >= 0 && r < board.length && c >= 0 && c < board[0].length)
    	// 		{
    	// 			if(board[r][c] != 0)
    	// 			{
    	// 				board[position[0]][position[1]] = rows[0].id;
    	// 				is_updated = true;
    	// 				break;
    	// 			}
    	// 		}
	    // 	}
	    // }
	    
	    // check position - is valid: check horizontal right
	    // var start_x_y = [position[0], position[1]],
	    // 	end_x_y = [position[0], board[0].length];
	    	
    	// var result = find_line(board, start_x_y, end_x_y, user_id, position, 'h');
	    // if(result[1] == true)
	    // 	is_updated = true;
	    // board = result[0];

	    // check position - is valid: check horizontal left
	    // start_x_y = [position[0], 0],
	    // 	end_x_y = [position[0], position[1]];
	    	
    	// result = find_line(board, start_x_y, end_x_y, user_id, position, 'h');
	    // if(result[1] == true)
	    // 	is_updated = true;
	    // board = result[0];

	    // check position - is valid: check vertical bottom
	    // start_x_y = [position[0], position[1]],
	    // 	end_x_y = [board.length, position[1]];

	    // result = find_line(board, start_x_y, end_x_y, user_id, position, 'v');
	    // if(result[1] == true)
	    // 	is_updated = true;
	    // board = result[0];
	    
	    // check position - is valid: check horisontal
	    var start_x_y = [position[0], 0],
	    	end_x_y = [position[0], board[0].length];

	    var result = find_line(board, start_x_y, end_x_y, user_id, position);
	    if(result[1] == true)
	    	is_updated = true;
	    board = result[0];
	    board[position[0]][position[1]] = 0;


	    // check position - is valid: check vertical
	    start_x_y = [0, position[1]],
    	end_x_y = [board.length, position[1]];

	    result = find_line(board, start_x_y, end_x_y, user_id, position);
	    if(result[1] == true)
	    	is_updated = true;
	    board = result[0];
	    board[position[0]][position[1]] = 0;

	    if(is_updated == false)
	    {
	    	socket.emit('set_position_error', 'check position - is_updated');
	    	return;
	    }

	    board[position[0]][position[1]] = user_id;

	    options_json = JSON.stringify(board);

        // get users by room
        connection.query("SELECT * FROM users WHERE game_room_id = ?", [room_id], function(err, rows){
        		if(err)
				    error('game->set_position:error', err, socket);

			    if(rows.length == 0 || err)
			    	return;

			    var next_user_id = 0;
			    var data = {};
			    data.board = options_json;			    

			    // get active user
			    for(var i = 0; i < rows.length; i++)
			    {
			    	// update board and active_user
			    	if(rows[i].id != user_id)
			    	{
			    		next_user_id = rows[i].id;
					    var query = "UPDATE game_rooms SET options = ?, active_user = ? WHERE id = ?;";
				        connection.query(query,[options_json, next_user_id, room_id]);
			        }
			    }

			    for(var i = 0; i < rows.length; i++)
			    {
			    	// send  notification
			    	data.user_id = rows[i].id;
			    	data.active_user = next_user_id;
			    	io.to(rows[i].socket_id).emit('board', data);
			    }
        });
	});
}

function fill_line(board, start_x_y, end_x_y, user_id)
{
	for (var r = start_x_y[0]; r <= end_x_y[0]; r++) 
	{
		for (var c = start_x_y[1]; c <= end_x_y[1]; c++)
		{
			board[r][c] = user_id;
		}
	}
	return board;
}

function find_line(board, start_xy, end_xy, user_id, target_xy)
{
	var line_start = [],
    	line_end = [],
    	enemy_counter = 0,
    	result = [],
    	is_updated = false,
    	is_target_finded = false,
    	row_start = start_xy[0],
    	row_end = end_xy[0],
    	cell_start = start_xy[1],
    	cell_end = end_xy[1];

	// console.log(start_xy);
	// console.log(end_xy);
	// console.log(target_xy);
	// console.log(user_id);

	for(var r = row_start; r <= row_end; r++)
	{
		for(var c = cell_start; c <= cell_end; c++)
	    {
	    	if(r < 0 || c < 0 || r >= 10 || c >= 10) continue;
	    	// console.log('check. ', 'r: ' + r, ', c: ' + c, board[r][c]);

	    	// if our point
	    	if(board[r][c] == user_id && enemy_counter == 0)
	    	{
	    		line_start = [r, c];
	    		is_target_finded = false;

	    		if(r == target_xy[0] && c == target_xy[1])
	    			is_target_finded = true;
	    		
	    		continue;
	    	}

	    	// if our point
	    	if(board[r][c] == user_id && enemy_counter > 0 && is_target_finded == false)
	    	{
	    		line_start = [r, c];
	    		enemy_counter = 0;
	    		continue;
	    	}

	    	// if our target
	    	if((r == target_xy[0] && c == target_xy[1]) && enemy_counter == 0)
	    	{
	    		line_start = [r, c];
	    		is_target_finded = true;
	    		continue;
	    	}

	    	// if our poind
	    	else if(board[r][c] == user_id && is_target_finded == true && enemy_counter > 0)
	    	{
	    		// win line
	    		line_end = [r, c];
	    		// console.log('win line 1');
	    		// console.log(line_start);
	    		// console.log(line_end);
	    		board = fill_line(board, line_start, line_end, user_id);
	    		is_target_finded = false;
	    		line_start = [];
	    		line_end = [];
	    		is_updated = true;
	    		break;
	    	}

	    	// if our poind - our point after target point
	    	else if(board[r][c] == user_id && is_target_finded == true && enemy_counter == 0)
	    	{
	    		line_start = [];
	    		is_target_finded = false;
	    	}

	    	// if our poind
	    	else if(board[r][c] == user_id && is_target_finded == false && enemy_counter > 0)
	    	{
	    		line_start = [];
	    		enemy_counter = 0;
	    		is_target_finded = false;
	    		break;
	    	}

			// if our poind
	    	else if((r == target_xy[0] && c == target_xy[1]) && enemy_counter > 0)
	    	{
	    		// win line
	    		line_end = [r, c];
	    		// console.log('win line 2');
	    		// console.log(line_start);
	    		// console.log(line_end);
	    		board = fill_line(board, line_start, line_end, user_id);
	    		is_target_finded = false;
	    		line_start = [];
	    		line_end = [];
	    		is_updated = true;
	    		break;
	    	}

	    	// if empty with target
	    	else if(line_start.length > 0 && board[r][c] == 0 && is_target_finded == true)
	    	{
	    		break;
	    	}

	    	// if empty without target
	    	// else if(line_start.length > 0 && board[r][c] == 0 && is_target_finded == false)
	    	else if(board[r][c] == 0)
	    	{
	    		is_target_finded = false;
	    		line_start = [];
	    		line_end = [];
	    		enemy_counter = 0;
	    	}

	    	// if enemy
	    	else if(line_start.length > 0 && board[r][c] != 0 && board[r][c] != user_id)
	    	{
	    		enemy_counter++;
	    	}
	    }
	}

	result[0] = board;
	result[1] = is_updated;

	return result;
}

function end_game(io, socket)
{
	// get cookie
	var client_cookie = cookie.parse(socket.request.headers.cookie);

	connection.query("SELECT id, game_room_id FROM users WHERE session_id = ?;", [client_cookie['express.id']], function(err, rows){
	    if(err)
		    error('game->end_game:error', err, socket);

	    if(rows.length == 0 || err)
	    	return;

	    // remove room
	    var query = "DELETE FROM game_rooms WHERE id = ?;";
        connection.query(query, [rows[0].game_room_id]);

        // get users by room
        connection.query("SELECT * FROM users WHERE game_room_id = ?", [rows[0].game_room_id], function(err, rows){
        		if(err)
				    error('game->end_game:error', err, socket);

			    if(rows.length == 0 || err)
			    	return;		    

			    for(var i = 0; i < rows.length; i++)
			    {
			    	// set clear db
				    var query = "UPDATE users SET game_room_id = ? WHERE id = ?;";
			        connection.query(query,[null, rows[i].id]);

			    	// send  notification
			    	io.to(rows[i].socket_id).emit('game_ended', true);
			    }
        });
	});
}

function game_mousemove(io, socket, xy)
{
	// get cookie
	var client_cookie = cookie.parse(socket.request.headers.cookie);

	connection.query("SELECT id, game_room_id FROM users WHERE session_id = ?;", [client_cookie['express.id']], function(err, rows){
	    if(err)
		    error('game->game_mousemove:error', err, socket);

	    if(rows.length == 0 || err)
	    	return;

        // get users by room
        connection.query("SELECT * FROM users WHERE game_room_id = ? AND id != ?", [rows[0].game_room_id, rows[0].id], function(err, rows){
        		if(err)
				    error('game->game_mousemove:error', err, socket);

			    if(rows.length == 0 || err)
			    	return;		    

			    io.to(rows[0].socket_id).emit('game_mousemove', xy);
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
	console.log(name);
	console.log(err);
	socket.emit('error', err);
}

module.exports = {
	find: find,
	get_board: get_board,
	set_position: set_position,
	end_game: end_game,
	game_mousemove: game_mousemove
}

