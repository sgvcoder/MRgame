var game3d_model = require(__dirname + '/model/game3d.js');

// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE
    // =====================================
    app.get('/', function(req, res) {
        res.render('main.ejs', {
            title: 'Homepage',
            descriptions: 'Homepage descriptions',
            user : req.user
        });
    });

    // =====================================
    // LOGIN
    // =====================================
    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            title: 'Login',
            descriptions: 'Login descriptions',
            message: req.flash('loginMessage'),
            user : req.user
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            // successRedirect : '/profile',
            successRedirect : '/dashboard',
            failureRedirect : '/login',
            failureFlash : true
        }),
        function(req, res) {
            if(req.body.remember)
            {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            }
            else
            {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
    });

    // =====================================
    // SIGNUP
    // =====================================
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', {
            title: 'Signup',
            descriptions: 'Signup descriptions',
            message: req.flash('signupMessage'),
            user : req.user
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    // =====================================
    // PROFILE SECTION
    // =====================================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            title: 'Profile',
            descriptions: 'Profile descriptions',
            user : req.user
        });
    });

    // =====================================
    // LOGOUT
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        req.session.destroy(function(){});
        res.redirect('/');
    });

    // =====================================
    // GAME - ROOM
    // =====================================
    app.get('/room/:room_id', isLoggedIn, function(req, res) {
        res.render('game.ejs', {
            title: 'Game',
            descriptions: 'Game descriptions',
            user : req.user,
            room_id: req.params.room_id
        });
    });

    // =====================================
    // 3D Game - Dashboard
    // =====================================
    app.get('/dashboard', isLoggedIn, function(req, res) {
        var view = (req.user.character_id) ? '3d/dashboard.ejs' : '3d/createCharacter.ejs';
        res.render(view, {
            title: '3D Game - Dashboard',
            descriptions: '3D Game - Dashboard descriptions',
            user: req.user
        });
    });

    // =====================================
    // 3D Game - Create Game
    // =====================================
    app.get('/createGame', isLoggedIn, function(req, res) {
        res.render('3d/createGame.ejs', {
            title: '3D Game - Create Game',
            descriptions: '3D Game - Create Game descriptions',
            user: req.user
        });
    });

    // =====================================
    // 3D Game - Game[room]
    // =====================================
    app.get('/game/:game_id', isLoggedIn, function(req, res) {
        res.render('3d/createGame.ejs', {
            title: '3D Game - Game',
            descriptions: '3D Game - Game descriptions',
            user: req.user,
            game_id: req.params.game_id
        });
    });

    // =====================================
    // 3D scene
    // =====================================
    app.get('/3dscene', isLoggedIn, function(req, res) {
        res.render('3d/map.ejs', {
            title: '3D Scene',
            descriptions: '3D Scene descriptions'
        });
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if(req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}