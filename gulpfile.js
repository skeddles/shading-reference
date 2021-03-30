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
var generateThumbnails = require('./generate-thumbnails.js');

//environment specific settings
console.log('ENV:',process.env.LIVE?'live':'dev');
var cssStyle = process.env.LIVE?'compressed':'compressed';
var jsDropConsole = process.env.LIVE==true;

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
	return gulp.src(['js/*.js','!js/_*.js'])

		.pipe(include({includePaths: ['js']})).on('error', console.log)
		//.pipe(sourcemaps.init())
		.pipe(uglify({compress: {drop_console: jsDropConsole }})).on('error', console.log)
		//.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest("./build/js"));
});

//css task - processes sass and minimizes scss files in /sass directory
gulp.task("css", function() {
	return gulp.src(['css/*.scss','!css/_*.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: cssStyle}).on('error', sass.logError))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest("./build/css"));
});

//img project task - minimizes gif,png,jpg,svg files for projects - in /img
gulp.task("image", function() {
	return gulp.src(' images/**/*.*')
		//minify
		.pipe(imagemin())
		//out
		.pipe(gulp.dest('build/images'));
});

//img project task - minimizes gif,png,jpg,svg files for projects - in /img
gulp.task("thumbnails", function(done) {
	generateThumbnails(done);
});

//████████████████████████████████████████████████████████████████████████████████
//████████████████████████████████ WATCHER / MASTER ██████████████████████████████
//████████████████████████████████████████████████████████████████████████████████


//the one task to rule them all
gulp.task('default',
	gulp.series(
		'html',
		'css',
		'image',
		'js',
		'thumbnails'
	)
);

//start watchers
gulp.task('watch', function(){

	console.log('\n███ STARTING WATCH ██████████████████████\n\n');

    //watch scripts folder for changes in any files
    gulp.watch(['html/*.htm'], gulp.series('html'));

    //watch scripts folder for changes in any files
    gulp.watch(['js/**/*.js*'], gulp.series('js'));

    //watch sass folder for changes in any files 
    gulp.watch(['css/**/*.scss'], gulp.series('css'));

    //watch image folder for changes in any files 
    gulp.watch(['images/**/*.*'], gulp.series('image'));

    //watch example file for changes
    gulp.watch(['examples.json'], gulp.series('thumbnails','js'));

});

/*global done*/