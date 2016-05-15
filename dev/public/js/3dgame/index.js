$(function () {
	$('body').tooltip({
		selector: '[data-toggle="tooltip"]'
	});
})

socket.on('reload page', function(){
	location.reload();
});

$('#createCharacter').off('click').click(function(e){
	var data = {
		id: 1
	};
	socket.emit('create character', data);
});

function _(str)
{
	return str;
}