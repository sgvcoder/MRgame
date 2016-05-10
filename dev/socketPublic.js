module.exports = function(io) {
	io.on('connection', function(socket){
		console.log('public connection');

		socket.on('disconnect', function(){
			// socket_model.disconnect(io, socket);
			io.emit('opponent disconnected', socket.id);
		});

		socket.on('send position', function(data){
			data.id = socket.id;
			io.emit('send position', data);
		});

		socket.on('use skill', function(data){
			data.id = socket.id;
			io.emit('use skill', data);
		});

	});
}