var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var livereload = require('gulp-livereload');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
// var ejs = require("gulp-ejs");
var ejsPrecompiler = require('gulp-ejs-precompiler');
var concat = require('gulp-concat');
var insert = require('gulp-insert');


var reportError = function (error) {
    notify({
        title: 'Gulp Task Error',
        message: 'Check the console.'
    }).write(error);

    console.error(error.toString());

    this.emit('end');
};

var sassSources = ['dev/public/sass/game.scss'];

gulp.task('dev:sass', function(){
    return gulp
        .src(sassSources)
        .pipe(sass().on('error', reportError))
        .pipe(cleanCSS())
        .pipe(livereload())
        .pipe(autoprefixer({
            browsers: ['safari 6', 'safari 7', 'safari 8', 'safari 9', 'IE 10', 'IE 11']
        }))
        .pipe(gulp.dest('dev/public/css'))
});

// gulp.task('dev:ejs', function(){
//     return gulp
//         .src('dev/views/3d/dashboard.ejs')
//         .pipe(ejs({
//             msg: 'Hello Gulp!'
//         }).on('error', reportError))
//         .pipe(livereload())
//         .pipe(gulp.dest('dev/views/compiled'));
// });

gulp.task('ejs', function() {
    return gulp.src('dev/views/3d/dashboard.ejs')
        .pipe(ejsPrecompiler({
            templateVarName: 'templates',
            compileDebug: true,
            client: true,
        }).on('error', reportError))
        .pipe(livereload())
        .pipe(insert.prepend('window.templates = {};' + "\n"))
        .pipe(gulp.dest('dev/views/compiled'));
});

gulp.task('watch', function () {
    livereload.listen({quiet: true});

    // watching sass files
    gulp.watch(['dev/public/sass/**/*.scss', 'dev/public/libs/*.css'], ['dev:sass']);

    // watching ejs files
    gulp.watch(['dev/views/**/*.ejs', 'dev/views/*.ejs'], ['ejs']);

});


gulp.task('dev', ['dev:sass', 'watch']);