var cookie = require('cookie'),
	passport = require('passport');

module.exports = function(io) {
	io.use(function(socket, next){
		var client_cookie = cookie.parse(socket.request.headers.cookie);
		passport.checkCookie(client_cookie['express.id'], next);
	});
}