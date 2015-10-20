var db = require("./mysqlDao");
var conn = db.conn;

function selectByName(name,callback){
	var sql = "SELECT * from user WHERE name=?";
	conn.query(sql,[name],function(err,res){
		if (err) {
			console.log("查询异常："+err);
			return;
		};
		callback(res);
	});
}

function checkUser(name,password,callback){
	var sql = "SELECT * from user WHERE name=?,password=?";
	conn.query(sql,[name,password],function(err,res){
		if (err) {
			console.log("查询异常："+err);
			return;
		};
		callback(res);
	});
}

module.exports ={
	selectByName:selectByName,
	checkUser:checkUser,
}