var userDao = require("../dao/userDao");
var logger = require("../lib/logConfig").logger("normal");

function checkUname(req,res){
	var name = req.param("name");

	userDao.selectByName(name,function(data){
		if (data.length&&data!=null) {
			res.json({msg:true});
		}else{
			res.json({msg:false});
		}
	});
}


module.exports = {
	GET:function(req,res){
		var path = req.path;
		path = path.split("/");
		switch (path[3]){
			case "unameCheck":checkUname(req,res)
			break;
		}
	},
	POST:function(req,res){

	}
}