var user = null;

/////////////////////////////////
// socket events
/////////////////////////////////

socket.on('player ready', function(){
	socket.emit('get character');
});

socket.on('character info', function(data){
	user = data;
	playerShowStatistics();
});

socket.on('redirect', function(data){
	location.href = data.url;
});

socket.on('find game started', function(data){
	$('#find_game').addClass('loading');
});

socket.on('canceled find game', function(data){
	$('#find_game').removeClass('loading');
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

socket.on('skills tree', function(data){
	if(typeof data.tree == 'undefined')
	{
		$('#modal').modal('hide');
		console.log('skills tree load error');
	}
	else
	{
		modalShowSkillsTree(data.tree)
	}
});

socket.on('skills new status', function(data){
	if(data.status == 'enabled')
	{
		$('.st-content [data-skill-id="' + data.skill_id + '"]').addClass('active');
	}
	else
	{
		$('.st-content [data-skill-id="' + data.skill_id + '"]').removeClass('active');
	}

	// update counter
	$('#st-count-activated').text($('#st-content .skill-box.active').length);
});

/////////////////////////////////
// jQuery events
/////////////////////////////////

contextMenuInit();
ScrollbarInit();

$('#find_game').click(function(e){
	e.preventDefault();
	socket.emit('find game');
});

// skills tree modal
$('#skills-tree').click(function(){
	// get skills tree
	socket.emit('get skills tree');

	// show modal
	var el = $('#modal');

	// set name
	el.find('.modal-title').text('[skills-tree]');

	// ыуе дщфвук
	el.find('.modal-body').html('').addClass('loding');

	// clear nav
	el.find('.modal-footer-nav').html('');

	// show modal
	el.modal('show');
});

/////////////////////////////////
// functions
/////////////////////////////////

function playerShowStatistics()
{
	if(typeof user.character == 'undefined')
	{
		return false;
	}

	// name
	$('#ch-name').text(user.character.name);

	// show avatar
	$('#ch-avatar').attr({
		src: '/images/characters/' + user.character.avatar
	}).removeClass('hidden');

	// stats
	var el = $('#ch-statistics');
	el.text('');
	el.append('<li><span>health</span><span>' + user.character.health + '</span></li>')
		.append('<li><span>strength</span><span>' + user.character.strength + '</span></li>')
		.append('<li><span>agility</span><span>' + user.character.agility + '</span></li>')
		.append('<li><span>intellect</span><span>' + user.character.intellect + '</span></li>');

	// skills
	el = $('#user-skills');
	el.text('');
	for (var i = 0; i < user.skills.length; i++)
	{
		el.append('<li><div class="skill-box" data-toggle="tooltip" data-placement="bottom" title="' + user.skills[i].name + '"><img src="/images/skills/' + user.skills[i].image + '"></div></li>');
	}
}

function modalShowSkillsTree(tree)
{
	var el = $('#modal'),
		content = $('<div class="st-content" id="st-content"></div>'),
		btn_save = '<button type="button" class="btn btn-dark btn-dark-green" id="skills-tree-apply">apply</button>',
		info_block = '<div class="st-skills-max-active">selected: <b><span id="st-count-activated">' + tree.countActivated + '</span>/' + user.maxActiveSkills + '</b></div>';

	// set content
	for (var b = 0; b < tree.branches.length; b++)
	{
		// create branch
		var branch = $('<div class="st-branch st-branch-' + b + '"></div>');
		branch.append('<span class="st-branch-name">' + tree.branches[b].name + '</span>');

		// set skills to branch
		var skills = $('<ul class="st-branch-skills"></ul>');
		for (var s = 0; s < tree.branches[b].skills.length; s++)
		{
			skills.append('<li><div class="skill-box ' + tree.branches[b].skills[s].statusClass + '" data-skill-id="' + tree.branches[b].skills[s].id + '" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + tree.branches[b].skills[s].name + '"><img src="/images/skills/' + tree.branches[b].skills[s].image + '" class="mCS_img_loaded"></div></li>');
		}
		branch.append(skills);

		content.append(branch);
	}
	el.find('.modal-body')
		.html('')
		.append(info_block)
		.append(content)
		.removeClass('loding');

	// buttons
	el.find('.modal-footer-nav')
		.html(btn_save);

	// mouse init
	$('#st-content .skill-box').off('click').click(function(e){
		e.preventDefault();
		var id = parseInt($(this).attr('data-skill-id'));
		if($(this).hasClass('active'))
		{
			// disable
			socket.emit('skills change status', {
				skill_id: id,
				status: 'disabled'
			});
		}
		else if($(this).hasClass('available') && $('#st-content .skill-box.active').length < user.maxActiveSkills)
		{
			// enable
			socket.emit('skills change status', {
				skill_id: id,
				status: 'enabled'
			});
		}
	});

	// save init
	el.find('#skills-tree-apply').off('click').click(function(e){
		e.preventDefault();

		// get active skulls
		var skills = [];
		$('.st-content [data-skill-id]').each(function(i){
			if($(this).hasClass('active'))
			{
				skills.push(parseInt($(this).attr('data-skill-id')));
			}
		});

		// save active skills
		socket.emit('skills save', {
			activeSkills: skills
		});
	});
}