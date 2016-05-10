socket.on('character info', function(data){
	console.log(data);
});

socket.on('redirect', function(data){
	location.href = data.url;
});

$('#find_game').click(function(e){
	e.preventDefault();
	socket.emit('find game');
});

socket.on('find game started', function(data){
	$('#find_game').parents('li').addClass('loading');
});

socket.on('canceled find game', function(data){
	$('#find_game').parents('li').removeClass('loading');
});

socket.on('find game 1x1 - confirm', function(data){
	if(confirm('Start the game?'))
	{
		socket.emit('confirmed find game');
	}
	else
	{
		socket.emit('cancel find game');
	}
});