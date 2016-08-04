// app/models/game3dBots.js
'use strict';

module.exports = {
	getBot: getBot
};

// load map config
var config = require('../config/game3d.js'),
	crypto = require('crypto');;

var BOTS = {
	bot_1: {
		moveSpeed: 4,
		position: {x: 0, y: config.scene.floor.position.y, z: 0},
		startPosition: {x: 0, y: config.scene.floor.position.y, z: 0},
		maxWalkDistance: 100,
		character: {
			name: 'Bot 1',
			avatar: 'butterfly.jpg',
			health: 600,
			energi: 400,
			maxHealth: 600,
			maxEnergi: 400,
			agility: 3,
			strength: 5,
			intellect: 3,
			model: 'threeObjects/butterfly_low.js'
		}
	}
};

function getBot(name)
{
	if(typeof BOTS[name] == 'undefined')
	{
		error('bot not found!', name)
		return false;
	}

	// clone bot & modify
	var bot = (JSON.parse(JSON.stringify(BOTS[name])));
	// bot.id = crypto.createHash('md5').update(new Date().getTime() + name).digest('hex');
	bot.id = 'bot_1';
	return bot;
}


function error(name, err)
{
	console.log(name, err);
}