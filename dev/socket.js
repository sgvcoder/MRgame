var game_model = require(__dirname + '/model/game.js'),
	game3d_model = require(__dirname + '/model/game3d.js'),
	socket_model = require(__dirname + '/model/socket.js');

module.exports = function(io) {
	io.on('connection', function(socket){
		// save new io session
		socket_model.connected(io, socket);

		socket.on('disconnect', function(){
			// socket_model.disconnect(io, socket);
			game3d_model.action(io, socket, {
				action: 'user_disconnect'
			});
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
		game3d_model.action(io, socket, {
			action: 'connection'
		});

		socket.on('get character', function(){
			game3d_model.getCharacter(socket);
		});

		socket.on('create character', function(data){
			game3d_model.createCharacter(io, socket, data);
		});

		socket.on('find game', function(data){
			game3d_model.action(io, socket, {
				action: 'player_start_find_1x1'
			});
		});

		socket.on('cancel find game', function(data){
			game3d_model.action(io, socket, {
				action: 'player_cancel_find_1x1'
			});
		});

		socket.on('confirmed find game', function(data){
			game3d_model.action(io, socket, {
				action: 'player_confirmed_game_1x1'
			});
		});

		socket.on('get skills tree', function(){
			game3d_model.action(io, socket, {
				action: 'skills_load_tree_for_player'
			});
		});

		socket.on('skills change status', function(data){
			game3d_model.action(io, socket, {
				action: 'skills_change_status_for_player',
				data: data
			});
		});

		socket.on('skills save', function(data){
			game3d_model.action(io, socket, {
				action: 'skills_apply_for_player',
				activeSkills: data.activeSkills
			});
		});
	});
}