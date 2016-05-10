var user = null;
socket.emit('get character', true);
socket.on('character info', function(data){
	user = data;
	el = '<li id="u' + data.user_id + '"><span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span><span class="name">' + data.name + '</span></li>'
	$(el).appendTo('#group_1');
});

$('#goto_group_1').click(function(e){
	e.preventDefault();
	$('#u' + user.user_id).detach().appendTo('#group_1');
	$('#u' + user.user_id + ' .avatar').insertBefore($('#u' + user.user_id + ' .name'));
	socket.emit('go to group 1');
});
$('#goto_group_2').click(function(e){
	e.preventDefault();
	$('#u' + user.user_id).detach().appendTo('#group_2');
	$('#u' + user.user_id + ' .name').insertBefore($('#u' + user.user_id + ' .avatar'));
	socket.emit('go to group 2');
});