/*
*将相应的文件信息写到文件表上面
*/
var db = require("./mysqlDao");
var conn = db.conn;
var logger = require("../lib/logConfig").logger("normal");