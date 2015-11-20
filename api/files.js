/*
*处理文件上传的逻辑
*/
var fs = require("fs");
var logger = require("../lib/logConfig").logger("normal");

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
	    console.log("保存"+filename+"成功");
	    res.json({"msg":"保存成功","resultCode":"1000"});
	});
}

module.exports = {
	GET:function(req,res){
		var path = req.path;
		path = path.split("/");
		/*switch (path[3]){
			case "unameCheck":checkUname(req,res)
			break;
		}*/
	},
	POST:function(req,res){
		var path = req.path;
		path = path.split("/");
		switch(path[3]){
			case "uploadImg":uploadImg(req,res)
			break;
		}
	}
}