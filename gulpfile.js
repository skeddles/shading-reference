var gulp = require('gulp');
var path = require('path');
var fs = require('fs');

//██████████ GULP PLUGINS ███████████████

var gutil = require('gulp-util');
var uglifyjs = require('uglify-es');
var composer = require('gulp-uglify/composer');
var uglify = composer(uglifyjs, console);
var sourcemaps = require('gulp-sourcemaps');
var include = require('gulp-include');
var sass = require('gulp-sass');
var handlebars = require('gulp-hb');
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var through = require('through2');
var svg = require('handlebars-helper-svg');

//████████████████████████████████████████████████████████████████████████████████
//████████████████████████████████ TASKS █████████████████████████████████████████
//████████████████████████████████████████████████████████████████████████████████

//html task - copies html files
gulp.task("html", function () {
	return gulp.src('html/*.htm')
		.pipe(gulp.dest("./build"));
});

//js task - combines and minimizes js files in /scripts directory
gulp.task("js", function() {
	return gulp.src('js/*.js')

		.pipe(include({includePaths: ['js']})).on('error', console.log)
		//.pipe(sourcemaps.init())
		.pipe(uglify({compress: {drop_console: true }})).on('error', console.log)
		//.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest("./build/js"));
});

//css task - processes sass and minimizes scss files in /sass directory
gulp.task("css", function(done) {
	return gulp.src('css/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest("./build/css"));
});

//████████████████████████████████████████████████████████████████████████████████
//████████████████████████████████ WATCHER / MASTER ██████████████████████████████
//████████████████████████████████████████████████████████████████████████████████


//the one task to rule them all
gulp.task('default',
	gulp.series(
		'html',
		'css',
		'js',
	)
);

//start watchers
gulp.task('watch', function(){

	console.log('\n███ STARTING WATCH ██████████████████████\n\n');

    //watch scripts folder for changes in any files
    gulp.watch(['html/*.htm'], gulp.series('html'));

    //watch scripts folder for changes in any files
    gulp.watch(['js/**/*.js'], gulp.series('js'));

    //watch sass folder for changes in any files
    gulp.watch(['css/**/*.scss'], gulp.series('css'));

});

/*global done*/