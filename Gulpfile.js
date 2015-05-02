(function() {
	'use strict';
	var gulp 		= require("gulp"),
		sass 		= require("gulp-ruby-sass"),
		server 		= require("gulp-develop-server"),
		browserify 	= require("gulp-browserify"),
		uglify 		= require("gulp-uglify"),
		minifyCSS 	= require("gulp-minify-css"),
		rename 		= require("gulp-rename");

	// sass compiler
	gulp.task("compile:css", function(){
		gulp.src("app/assets/styles/*.scss")
			.pipe(sass())
			.pipe(gulp.dest("app/assets/styles"));
	});

	// Minify css
	gulp.task("minify:css",  function() {
  		gulp.src("app/assets/styles/style.css")
  			.pipe(minifyCSS({keepSpecialComments:0}))
  			.pipe(rename("style.min.css"))
    		.pipe(gulp.dest("app/assets/styles"));
	});

	// Browserify
	gulp.task("scripts:browserify", function() {
	    gulp.src("app/assets/scripts/main.js")
	        .pipe(browserify({
	        	insertGlobals : true
	        }))
	        .pipe(gulp.dest("app/assets"));
	});

	// Uglify js
	gulp.task("scripts:uglify", function() {
  		gulp.src("app/assets/main.js")
  			.pipe(uglify())
  			.pipe(rename("main.min.js"))
    		.pipe(gulp.dest("app/assets"));
	});

	// Server start
	gulp.task("server:start", function() {
	    server.listen({path: './server/main.js'});
	});
	// Server kill
	gulp.task("server:restart", function() {
		server.restart();
	});

	// WATCH
	// =====
	gulp.task("watch", ["compile:css", "scripts:browserify", "server:start"], function(){
		gulp.watch(["app/assets/styles/*.scss"], ["compile:css"]);
		gulp.watch(["app/assets/styles/style.css"], ["minify:css"]);
		gulp.watch(["app/assets/scripts/*.js"], ["scripts:browserify"]);
		gulp.watch(["app/assets/main.js"], ["scripts:uglify"]);
		gulp.watch(["server/*.js"], ["server:restart"]);
	});
})();