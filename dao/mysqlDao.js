//连接mysql数据库
var mysql = require('mysql');
var logger = require("../lib/logConfig").logger("normal");

var conn = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"",
	database:"test",
	port:"3306"
});

conn.connect(function(err){
	if (err) {
		logger.error("mysql数据库连接异常:"+err);

		return
	};

	console.log("mysql数据库连接成功");
});

module.exports = {
	conn:conn
}