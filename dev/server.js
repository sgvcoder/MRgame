// load modules
var express = require('express'),
	app = express();

var http = require('http').Server(app),
	io = require('socket.io')(http);

var httpPublic = require('http').Server(app),
	ioPublic = require('socket.io')(httpPublic);

/**
 * middleware - Express
 */
var middlewareExpress = require(__dirname + '/middleware')(app, express, io);

/**
 * middleware - IO Socket
 */
var middlewareSocket = require(__dirname + '/middleware/socket')(io),
	socketEvents = require(__dirname + '/socket')(io);

var socketPublicEvents = require(__dirname + '/socketPublic')(ioPublic);

// http.listen(9000, "192.168.0.106", function(){
http.listen(9000, "192.168.0.103", function(){
	console.log('listening on *:9000');
});

ioPublic.listen(9001);