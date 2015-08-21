var express=require("express");
var bodyParser=require("body-parser");
var multer=require("multer");
var session=require("express-session");
var http=require("http");
var path = require('path');
var conf = require("./config/config");

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
	res.locals.user = req.session.user;//res.locals保存在一次请求范围内的本地变量值
	var err = req.session.error;
	res.locals.message = '';
	if (err) res.locals.message = '<div style="margin-bottom: 20px;color:red;">' + err + '</div>';
	next();
});

app.get("*",function(req,res){
	/*if(req.session.user){
		res.render("./static/src/index");
	}else{
		res.render("./view/login");
	}*/
	res.render("./static/src/index");
});

app.listen(conf.listenPort,conf.server);