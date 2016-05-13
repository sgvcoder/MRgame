// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require(__dirname + '/database');
var connection = mysql.createConnection(dbconfig.connection);

var cookie = require('cookie');

connection.query('USE ' + dbconfig.database);

// expose this function to app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT U.*, C.id AS 'character_id' FROM users AS U LEFT JOIN users_to_characters AS C ON C.user_id = U.id WHERE U.id = ?;", [id], function(err, rows){
            if(rows.length == 0 || err)
            {
                // done(err, rows[0]);
                return;
            }

            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);

                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username

                    // get session
                    var session_id = req.cookies['express.id'];

                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null),
                        session_id: session_id
                    };

                    var insertQuery = "INSERT INTO users (username, password, session_id) VALUES (?, ?, ?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.session_id],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // get user
                var user = rows[0];

                // get session
                var session_id = req.cookies['express.id'];

                // update session of user (use socket.io)
                var updateQuery = "UPDATE users SET session_id = ? WHERE id = ?";
                connection.query(updateQuery,[session_id, user.id]);

                // all is well, return successful user
                return done(null, user);
            });
        })
    );

    passport.checkCookie = function(session_id, next) {
        connection.query("SELECT U.*, C.id AS 'character_id' FROM users AS U LEFT JOIN users_to_characters AS C ON C.user_id = U.id WHERE U.session_id = ?;", [session_id], function(err, rows){
            if (err)
                return 'Error: err';
            if (!rows.length) {
                return 'User not found.';
            }
            next();
        });
    };
};