var db = require("./mysqlDao");
var conn = db.conn;
var logger = require("../lib/logConfig").logger("normal");

function selectByName(name,callback){
	var sql = "SELECT * from user WHERE name=?";
	conn.query(sql,[name],function(err,res){
		if (err) {
			logger.error("查询异常："+err);
			return;
		};
		callback(res);
	});
}

function checkUser(name,password,callback){
	var sql = "SELECT * from user WHERE name=?&&password=?";
	conn.query(sql,[name,password],function(err,res){
		if (err) {
			logger.error("查询异常："+err);
			return;
		};
		callback(res);
	});
}

function registerUser(options,callback){
	var sql = "INSERT into user set ?";

	conn.query(sql,options,function(err,res){
		if (err) {
			logger.error("新增异常："+err);
			return
		};

		callback(res);
	});
}

module.exports ={
	selectByName:selectByName,
	checkUser:checkUser,
	registerUser:registerUser
}