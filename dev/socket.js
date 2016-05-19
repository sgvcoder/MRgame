var game3d_model = require(__dirname + '/model/game3d.js'),
	game3dLogic_model = require(__dirname + '/model/game3dLogic.js'),
	socket_model = require(__dirname + '/model/socket.js');

module.exports = function(io) {

	/**** 3D Game Logic - events ****/
	game3dLogic_model.loopGameActionsInit(io);

	io.on('connection', function(socket){
		// save new io session
		socket_model.connected(io, socket);

		socket.on('disconnect', function(){
			// socket_model.disconnect(io, socket);
			game3d_model.action(io, socket, {
				action: 'user_disconnect'
			});
		});

		// init events of game3dLogic
		game3dLogic_model.action(io, socket, {
			action: 'eventsInit'
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