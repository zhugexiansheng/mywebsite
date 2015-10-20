var express=require("express");
var bodyParser=require("body-parser");
var multer=require("multer");
var session=require("express-session");
var http=require("http");
var path = require('path');
var conf = require("./config/config");
var tool = require("./lib/tools");
var log4js = require("./lib/logConfig");
var myApp = {};

var partials = require("express-partials");

var app=express();

app.use(partials());

app.set("views",__dirname);//设置视图路径
app.set("view engine","html");//设置使用的模板引擎，设置模板渲染的后缀名为html的页面
app.engine(".html",require("ejs").__express);//使用ejs的扩展函数来扩展渲染html后缀的页面的模板引擎
app.use(express.static(path.join(__dirname, conf.staticFolder)));//通过use中间件来指定一个静态资源路径

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer());

app.use(log4js.log4js.connectLogger(log4js.logger("normal"), {level: 'auto', format:':method :url'}));

//设置session,session可以在req和res中都能使用
app.use(session({
	secret:'secret',
	resave:true,
	saveUninitialized:false,
	cookie:{
		maxAge:conf.sessionExpire
	}
}));

//添加一个中间件用来处理session 对于每一次请求都进行相应的处理
app.use(function(req,res,next){
	var path = req.path;
	if(path=="/"){
		res.render("./static/dist/index",{title:conf.webDetail.title});
	}else{
		next();
	}
});

var api = ["user"];
var each = tool.each;
var extend = tool.extend;
myApp.api={};

each(api,function(x){
	myApp.api[x]={};
	extend(myApp.api[x],require("./api/"+x));
});

app.all("*",function(req,res){
	var path = req.path;
	var method = req.method;

	path = path.split("/");
	if (myApp.api[path[2]]) {
		myApp.api[path[2]][method](req,res);		
	}
});

app.listen(conf.listenPort,conf.server);