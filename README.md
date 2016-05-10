// config/database.js
module.exports = {
    'connection': {
        'host': 'localhost',
        'user': 'root',
    	'password': ''
    },
	'database': 'db_name',
    'users_table': 'users',
    'session': {
    	'key': '__key__',
    	'secret': '__secret__',
    	'resave': true,
    	'saveUninitialized': true
    }
};