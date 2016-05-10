module.exports = function(app, express, io){

	// modules
	var cookie = require('cookie'),
		session = require('express-session'),
		passport = require('passport'),
		cookieParser = require('cookie-parser'),
		bundle = require('socket.io-bundle');
		ioPassport = require('socket.io-passport'),
		passportSocketIo = require("passport.socketio"),
		engine = require('ejs-locals'),
		bodyParser = require('body-parser'),
		morgan = require('morgan'),
		flash = require('connect-flash');

	// configs
	var dbconfig = require(__dirname + '/../config/database'),
		passportconfig = require(__dirname + '/../config/passport')(passport);

	// log every request to the console
	app.use(morgan('dev'));

	// get information from html forms
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	// Set public folder for static files
	app.use(express.static(__dirname + '/../public'));

	app.engine('ejs', engine);
	app.set('views', __dirname + '/../views/');

	// set up ejs for templating
	app.set('view engine', 'ejs');

	// use connect-flash for flash messages stored in session
	app.use(flash());

	app.use(express.static(__dirname + '/../views/'));

	// required for passport
	app.use(cookieParser());
	app.use(session({
		key: dbconfig.session.key,
		secret: dbconfig.session.secret,
		resave: dbconfig.session.resave,
		saveUninitialized: dbconfig.session.saveUninitialized
	 }));
	app.use(passport.initialize());
	app.use(passport.session());

	// check authorization
	// io.use(function(socket, next){
	// 	var client_cookie = cookie.parse(socket.request.headers.cookie);
	// 	passport.checkCookie(client_cookie['express.id'], next);
	// });

	// load routes and pass in app and fully configured passport
	require(__dirname + '/../routes.js')(app, passport);
}