/*
*http请求处理库，对http请求进行相应的处理
*/
//对post请求进行处理
function postHandle(req,res,callback){
	var arr = [];
	req.on("data",function(data){
		arr.push(data);
	});

	req.on("end",function(){
		var data = Buffer.concat(arr).toString(),ret;
		try{
			ret = JSON.parse(data);
		}catch(err){
			logger.error(err);
		}

		req.body = ret;

		callback(req,res);
	})
}

module.exports = {
	postHandle:postHandle
}