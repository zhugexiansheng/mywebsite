'use strict';

var gulp = require("gulp");
var watch = require("gulp-watch");
var less = require("gulp-less");
var gulpSequence = require('gulp-sequence');//进行队列化操作
var clean = require("gulp-clean");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");//压缩js文件
var minifyHtml = require("gulp-minify-html");//压缩html文件
var minifyCss = require("gulp-minify-css");//压缩css文件
var usemin = require("gulp-usemin");//将某文件里面使用的文件重命名
var merge2 = require("merge2");//将多个流合成一个流
var server = require("gulp-develop-server");
var path = require("path");

gulp.task("clean",function(){
	return gulp.src(['public/src/css/*']).pipe(clean({force:true}));
});

gulp.task("less",function(){
	return gulp.src(["public/src/less/*.less"])
	      .pipe(less())
	      .pipe(concat("app.css"))
	      .pipe(gulp.dest("public/src/css"));
});

gulp.task("server:start",function(){
	server.listen({path:"./app.js"});
});

gulp.task("default",gulpSequence("clean",["less","server:start"]));