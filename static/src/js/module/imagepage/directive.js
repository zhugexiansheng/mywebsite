/*
*文件上传组件
*/
myApp.directive("upLoader",["restAPI",function(restAPI){
	return {
		link:function($scope, element, attrs){
			function createXhrHttpRequest(){
				if (window.ActiveXObject) {
					return new ActiveXObject("Microsoft.XMLHTTP");
				}else{
					return new XMLHttpRequest();
				}
			}

			element.bind("change",function(event){
				var data = new FormData();
				data.append("file",element[0].files[0]);

				var key = "";

		        if(element[0].files[0].name){
		            key = "/" + new Date().valueOf() + "/" + element[0].files[0].name;
		        }

		        data.append("key",key);

		        $scope.loadStart(key);
			
			    restAPI.getQiniuToken.get({bucketname:"zhugemaolu"},function(resData){
			    	var token = resData.token;

			    	data.append("token",token);

					var xmlHttp = createXhrHttpRequest();

					xmlHttp.onreadystatechange = function(){
						if (xmlHttp.readyState==4&&xmlHttp.status==200) {
							//回调上层控制器的方法
		                	$scope.loadComplete(JSON.parse(xmlHttp.response));
						};
					}

					/*每0.5秒/1秒调用一次*/
					xmlHttp.upload.onprogress = function(e){
						var loaded = e.loaded;
						var total = e.total;

						var per = Math.round(100*loaded/total);

						$scope.loadProgress(key,per);
					}

					xmlHttp.open('POST',"http://up.qiniu.com");
					xmlHttp.send(data);

			        /*$.ajax({
		                url: "http://up.qiniu.com",
		                type: 'POST',
		                data: data,
		                processData: false,
		                contentType: false
		            }).done(function(res2){
		            	//回调上层控制器的方法
		                $scope.loadComplete(res2);
		            });*/
			    });
			});
		}
	}
}]);

//每个图片的操作指令
myApp.directive("imgControl",["restAPI",function(restAPI){
	return {
		link:function(scope,element,attrs,ngModel){
			scope.showOprate = false;
			var key = attrs.imgKey;

			$(element).hover(function(){
				scope.$apply(function(){
					scope.showOprate = true;
				});
			},function(){
				scope.$apply(function(){
					scope.showOprate = false;
				});
			});

			scope.deleteImage = function(){
				restAPI.deleteQiniuFiles.post({bucketname:"zhugemaolu",key:key},function(res){
					scope.deleteList(res.key);
				});
			}
		}
	}
}]);

//圆形进度条css3实现，效果不好
/*myApp.directive("circle",function(){
	return {
		template:'<div class="bd-circle"><div class="pie-left"></div><div class="pie-right"></div></div>',
		replace:true,
		restrice:"E",
		link:function(scope,element,attrs,ngModel){
			scope.$on("pie",function(e,msg){
				if (msg<=50) {
					$(element).find(".pie-right").css("transform","rotate("+msg*3.6+"deg)");
				}else{
					$(element).find(".pie-right").css("transform","rotate(180deg)");
					$(element).find(".pie-left").css("transform","rotate("+(msg-50)*3.6+"deg)");
				}
			});
		}
	}
});*/

//canvas实现扇形进度条
myApp.directive("circle",function(){
	return {
		template:"<canvas class='bd-circle'></canvas>",
		replace:true,
		restrice:"E",
		link:function(scope,element,attrs,ngModel){
			var id = "canvas_"+new Date().getTime();
			$(element).attr("id",id);
			var canvas = document.getElementById(id);
			var ctx = canvas.getContext('2d');
			// 位移到圆心，方便绘制
			ctx.translate(45, 45);
			ctx.fillStyle="#ccc";
			ctx.font = "20px Courier New";
			ctx.strokeStyle="black";

			scope.$on("pie",function(e,msg){
				ctx.clearRect(0,0,180,90);
				// 开始一条新路径
				ctx.beginPath();
				// 移动到圆心
				ctx.moveTo(0, 0);
				// 绘制圆弧
				ctx.arc(0, 0, 45, 0, 0.02*msg*Math.PI);
				// 闭合路径
				ctx.closePath();
				ctx.fill();

				ctx.strokeText(msg+"%",0,0);
			})
		}
	}
});