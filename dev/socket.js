var game_model = require(__dirname + '/model/game.js'),
	game3d_model = require(__dirname + '/model/game3d.js'),
	socket_model = require(__dirname + '/model/socket.js');

module.exports = function(io) {
	io.on('connection', function(socket){
		// save new io session
		socket_model.connected(io, socket);

		socket.on('disconnect', function(){
			// socket_model.disconnect(io, socket);

			delete(socketsData[socket.id]);
		});

		socket.on('find_game', function(flag){
			game_model.find(io, socket);
		});

		socket.on('get_board', function(flag){
			game_model.get_board(socket);
		});

		socket.on('set_position', function(position){
			game_model.set_position(io, socket, JSON.parse(position));
		});

		socket.on('end_game', function(flag){
			game_model.end_game(io, socket);
		});

		socket.on('game_mousemove', function(xy){
			game_model.game_mousemove(io, socket, xy);
		});

		/**** 3D Game - events ****/
		socketsData[socket.id] = {
			status: 'available'
		};

		socket.on('get character', function(){
			game3d_model.getCharacter(io, socket);
		});

		socket.on('create character', function(data){
			game3d_model.createCharacter(io, socket, data);
		});

		socket.on('find game', function(data){
			socket.join('find game 1x1');
			socket.emit('find game started');

			// set status
			socketsData[socket.id].status = 'waiting';

			var waitingPlayers = [];

			Object.keys(socketsData).forEach(function(key){
		        if(typeof socketsData[key] == 'object')
		        {
		        	if (io.sockets.connected[key] && socketsData[key].status == 'waiting')
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
			    	socketsData[waitingPlayers[i]].status = 'starting';
				    io.sockets.connected[waitingPlayers[i]].emit('find game 1x1 - confirm');
				    console.log('send confirm to ', waitingPlayers[i]);
			    }
			}
		});

		socket.on('cancel find game', function(data){
			// get rooms of socket
			var rooms = io.sockets.adapter.sids[socket.id];

			Object.keys(rooms).forEach(function(key){
		        if(key == 'find game 1x1')
		        {
		        	// get sockets of room
					var socketsRoom = io.sockets.adapter.rooms[key].sockets;

					Object.keys(socketsRoom).forEach(function(socketKey){
						if(typeof socketsData[socketKey] == 'object' && (socketsData[socketKey].status == 'starting' || socketsData[socketKey].status == 'confirmed'))
						{
				        	// set status
							socketsData[socketKey].status = 'available';

							// send notify
							io.sockets.connected[socketKey].emit('canceled find game');
						}
				    });
		        }
		    });
		});

		socket.on('confirmed find game', function(data){
			if(socketsData[socket.id].status != 'starting')
				return false;

			// set status
			socketsData[socket.id].status = 'confirmed';

			var confirmedPlayers = [];

			Object.keys(socketsData).forEach(function(key){
		        if(typeof socketsData[key] == 'object')
		        {
		        	if (io.sockets.connected[key] && socketsData[key].status == 'confirmed')
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
			    	socketsData[confirmedPlayers[i]].status = 'in game';
				    io.sockets.connected[confirmedPlayers[i]].emit('redirect', {
				    	url: '/3dscene'
				    });
				    console.log('in game ', confirmedPlayers[i]);
			    }
			}
		});
	});
}

var socketsData = {};


var interval = setInterval(function(str1, str2) {
  console.log(str1 + " " + str2);
}, 1000, "Hello.", "How are you?");