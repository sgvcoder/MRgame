$('#start').off('click').click(function(e){
	e.preventDefault();
	socket.emit('find_game', true);
});

socket.on("room_id", function(data){
	location.href = '/room/' + data;
});