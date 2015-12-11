/*
*处理文件上传的逻辑
*/
var fs = require("fs");
var logger = require("../lib/logConfig").logger("normal");
var qiniu = require("qiniu");

qiniu.conf.ACCESS_KEY = 'i4aRUHiCM3Aaf-PNqM_q3qUzXn-D2CWg7ECvGNGA';
qiniu.conf.SECRET_KEY = 'yIqKDvHxyGPkGSvHmPq_4IAADwGQUvQa9lwHzUY1';

var qiniuDomain = "7xokhe.com1.z0.glb.clouddn.com";
var client = new qiniu.rs.Client();

//自己处理上传文件，上传到指定本地指定的文件夹
function uploadImg(req,res){
	var imgsays = [];
	var num = 0;
	var isStart = false;
	var ws;
	var filename;
	var path;
	req.on('data' , function(chunk){
	    var start = 0;
	    var end = chunk.length;
	    var rems = [];

        /*
        *数据包的前面的4个/r/n之后就是文件数据，而结尾的话则是去掉\r\n--WebKitFormblabla--\r\n
        */
	    for(var i=0;i<chunk.length;i++){
	        if(chunk[i]==13 && chunk[i+1]==10){//判断是否是\r\n
	            num++;
	            rems.push(i);

	            if(num==4){//从文件头取出文件名
	                start = i+2;
	                isStart = true;

	                var str = (new Buffer(imgsays)).toString();
	                filename = str.match(/filename=".*"/g)[0].split('"')[1];
	                path = './tmp/'+filename;
	                ws = fs.createWriteStream(path);//打开一个文件写入流

	            }else if(i==chunk.length-2){    //说明到了数据尾部的\r\n
	                end = rems[rems.length-2];
	                break;
	            }
	        }

	        if(num<4){
	            imgsays.push(chunk[i])
	        }
	    }

	    //处理完一段数据之后直接写入文件
	    if(isStart){
	        ws.write(chunk.slice(start , end));
	    }
	});

	req.on("end",function(){
	    ws.end();
	    logger.info("保存"+filename+"成功");
	    res.json({"msg":"保存成功","resultCode":"0000"});
	});
}

//获取七牛的token
function getQiniuToken(req,res){
	var bucketname = req.param("bucketname");

	var token = uptoken(bucketname);

	res.json({"msg":"成功","resultCode":"0000","token":token});
}

//七牛上传凭证生成
function uptoken(bucketname) {
  var putPolicy = new qiniu.rs.PutPolicy(bucketname);
  //putPolicy.callbackUrl = callbackUrl;
  //putPolicy.callbackBody = callbackBody;
  //putPolicy.returnUrl = returnUrl;
  //putPolicy.returnBody = returnBody;
  //putPolicy.asyncOps = asyncOps;
  //putPolicy.expires = expires;

  return putPolicy.token();
}

var marker = "";

//获取七牛的文件列表
function getQiuniuFiles(req,res){
	var bucketname = req.body.bucketname;
	var prefix = req.body.prefix || "";
	var limit = req.body.limit || "";

	qiniu.rsf.listPrefix(bucketname, prefix, marker, limit, function(err, ret) {
		if (!err) {
		   // process ret.marker & ret.items
		  marker = ret.marker;
		  for(var i=0;i<ret.items.length;i++){
		   	ret.items[i].url = downloadUrl(qiniuDomain,ret.items[i].key);
		  }

		  res.json({"msg":"成功",resultCode:"0000",list:ret.items});
		} else {
		  logger.error("七牛获取文件失败"+err);
		  res.json({"msg":"七牛获取文件失败",resultCode:"1000"});
		}
	});
}

//获取单个图片的下载路径
function getImageUrl(req,res){
	var key = req.param("key");

	res.json({msg:"成功",resultCode:"0000",url:downloadUrl(qiniuDomain,key)});
}

//生成七牛私有文件下载路径,生成缩略图
function downloadUrl(domain, key) {
  var baseUrl = qiniu.rs.makeBaseUrl(domain, key);
  // 生成fop_url
  var iv = new qiniu.fop.ImageView();
  iv.width = 100;
  baseUrl = iv.makeRequest(baseUrl);

  var policy = new qiniu.rs.GetPolicy();
  return policy.makeRequest(baseUrl);
}

//删除七牛空间文件
function deleteQiniuFiles(req,res){
	var key = req.body.key;
	var bucketname = req.body.bucketname;

	client.remove(bucketname, key, function(err, ret) {
	  if (!err) {
	    res.json({msg:"文件删除成功",resultCode:"0000",key:key});
	  } else {
	    logger.error("文件删除失败："+err);
	    res.json({msg:"文件删除失败",resultCode:"1002"});
	  }
	})
}

module.exports = {
	GET:function(req,res){
		var path = req.path;
		path = path.split("/");
		switch (path[3]){
			case "getQiniuToken":getQiniuToken(req,res)
			break;
			case "getImageUrl":getImageUrl(req,res)
			break;
		}
	},
	POST:function(req,res){
		var path = req.path;
		path = path.split("/");
		switch(path[3]){
			case "uploadImg":uploadImg(req,res)
			break;
			case "getQiuniuFiles":getQiuniuFiles(req,res)
			break;
			case "deleteQiniuFiles":deleteQiniuFiles(req,res)
			break;
		}
	}
}