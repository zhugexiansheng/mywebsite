/*
*通用配置文件
*/

var path = require("path"),
    progressPath = path.dirname(process.argv[1]);//用来替代__dirname获取当前启动的根目录

module.exports = {
	server : "127.0.0.1",//设置访问域名
	listenPort : "8001",//访问端口
	staticFolder : "/static",//静态文件存放位置
	sessionExpire : 1000*60*10,//设置session存活时间
	webDetail : {
		title : "诸葛茅庐",
	},
	dataBase:{
		host:"localhost",
		user:"root",
		password:"",
		database:"test",
		port:"3306"
	}
};