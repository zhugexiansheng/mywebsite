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
var ngTemplate = require('gulp-ng-template');//将angularjs里面使用的template通过$template的服务将其重新分为用js实现的模板
var server = require("gulp-develop-server");
var path = require("path");
var jshint = require("gulp-jshint");
/*var cssSprite = require("gulp-css-spritesmith");*/

gulp.task("clean",function(){
	return gulp.src(["static/dist/*"])
	       .pipe(clean({force:true}));
});

/*gulp.task("imgSprite",function(){
	return gulp.src("static/src/less/icon.less")
		   .pipe(less())
		   .pipe(cssSprite({

		   }))
});*/

gulp.task("css",function(){
	return merge2(
			   gulp.src(["static/src/less/*.less"])
		       .pipe(less()),
		       gulp.src("static/bower_components/bootstrap/dist/css/bootstrap.css")
	       )
	       .pipe(concat("app.css"))
	       .pipe(gulp.dest("static/dist/css/"));
});

gulp.task("jshint",function(){
	return gulp.src(['*.js','config/*.js','static/src/js/*'])
	       .pipe(jshint())
	       .pipe(jshint.reporter());
});

gulp.task("js-lib",function(){
	return gulp.src([
		"static/bower_components/jquery/dist/jquery.js",
		"static/bower_components/angular/angular.js",
		"static/bower_components/angular-animate/angular-animate.js",
		"static/bower_components/angular-cookies/angular-cookies.js",
		"static/bower_components/angular-ui-router/release/angular-ui-router.js",
		"static/bower_components/angular-resource/angular-resource.js"
	]).pipe(concat("lib.js"))
	.pipe(gulp.dest("static/dist/js/"));
});

gulp.task("js-app",function(){
	return merge2(
			   gulp.src(["static/src/js/*","static/src/js/*/*.js","static/src/js/*/*/*.js"]),
			   gulp.src("static/src/tpl/*.html")
		   	   .pipe(minifyHtml({empty: true, quotes: true}))
		   	   .pipe(ngTemplate({
		          moduleName: 'genTemplates',
		          standalone: true,
		          filePath: 'templates.js'
		        })
		   	   )
		   )
	       .pipe(concat("app.js"))
	       .pipe(gulp.dest("static/dist/js/"));
});

//将静态文件和首页的index.html放在dist目录下
gulp.task('files', function () {
  return gulp.src(['static/src/{md,img}/*.*',
                  'static/src/*.*'])
    .pipe(gulp.dest('static/dist'));
});

//静态图片文件
gulp.task("macimg",function(){
	return gulp.src(["static/src/img/mac/*"])
	.pipe(gulp.dest("static/dist/img/mac"));
});

//web文字的处理
gulp.task("fonts",function(){
	return gulp.src(['static/bower_components/bootstrap/dist/fonts/*'])
	       .pipe(gulp.dest('static/dist/fonts/'));
});

//可以将本地开发和正式的代码进行监听，就是监听文件的变化，来将文件同步到生产环境上的代码
gulp.task("watch",function(){
	server.listen({path:"./app.js"},function(err){
		if(err){
			return console.log(err);
		}

		gulp.watch(["static/src/js/*","static/src/js/*/*.js","static/src/js/*/*/*.js","static/src/tpl/*.html"],function(){
			gulp.run("js-app");
		});

		gulp.watch("static/src/less/*",function(){
			gulp.run("css");
		});

		gulp.watch(['static/src/{md,img}/*', 'static/src/*.*'],function(){
			gulp.run('files');
		});
	});
});

gulp.task("default",gulpSequence('clean', 'jshint', ['css', 'js-lib', 'js-app', 'files','fonts','macimg','watch']));