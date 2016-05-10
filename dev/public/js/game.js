// get board
socket.emit('get_board', true);

// display board
socket.on("board", function(data){
	var board = $.parseJSON(data.board),
		table = '',
		css_class = '',
		target_td;

	set_active_player(data.user_id, data.active_user);

	if($('#board tr').length > 0)
	{
		for(var r = 0; r < board.length; r++)
		{
			for(var c = 0; c < board.length; c++)
			{
				css_class = (data.user_id == board[r][c]) ? 'my' : (board[r][c] == 0) ? '' : 'enemy'
				target_td = $('#board tr').eq(r).find('td').eq(c);
				if(target_td.hasClass(css_class) == false && css_class != '')
					target_td.attr('class', css_class);
			}
		}
		return;
	}

	for(var r = 0; r < board.length; r++)
	{
		table += '<tr>';
		for(var c = 0; c < board.length; c++)
		{
			css_class = (data.user_id == board[r][c]) ? 'my' : (board[r][c] == 0) ? '' : 'enemy'
			css_class = (css_class) ? ' class="' + css_class + '"' : '';
			table += '<td' + css_class + '><span class="ball"><span><span></span></span></span></td>';
		}
		table += '</tr>';
	}
	$('#board').html(table);
	board_events();
});

// game ended
socket.on("game_ended", function(data){
	// clear events
	$('#board td').off('click');
	alert('Game is stopped!');
});

$('#quit').off('click').click(function(e){
	e.preventDefault();
	socket.emit('end_game', true);
});

// $('body').mousemove(function(e){
// 	socket.emit('game_mousemove', [e.clientX, e.clientY]);
// });
// socket.on("game_mousemove", function(data){
// 	// clear events
// 	$('#enemy_mouse').css({
// 		left: data[0],
// 		top: data[1]
// 	});
// });

function set_active_player(my_id, active_id)
{
	if(my_id == active_id)
	{
		$('#game_steps .my').addClass('active');
		$('#game_steps .enemy').removeClass('active');
	}
	else
	{
		$('#game_steps .my').removeClass('active');
		$('#game_steps .enemy').addClass('active');
	}
}

function board_events()
{
	// set position
	$('#board td').off('click').click(function(e){
		e.preventDefault();
		var data = [
			$(this).parents('tr').index(),
			$(this).index()
		];
		socket.emit('set_position', JSON.stringify(data));
	});
}
