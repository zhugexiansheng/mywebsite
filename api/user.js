var userDao = require("../dao/userDao");

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

function userLogin(req,res){
	userDao.checkUser(req.body.username,req.body.password,function(data){
		if (data.length&&data!=null) {
			req.session.user = data[0];
			res.json({msg:"登录成功",resultCode:"0000",list:data});
		}else{
			res.json({msg:"密码错误",resultCode:"1000"});
		}
	})
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
		var path = req.path;
		path = path.split("/");
		switch(path[3]){
			case "userLogin":userLogin(req,res)
			break;
		}
	}
}