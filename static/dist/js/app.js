/*
* angularjs的主要入口
*/
var myApp = angular.module("myApp",["ui.router","ngCookies","ngAnimate",'ngResource',"genTemplates",'pasvaz.bindonce']);

myApp.config(['$httpProvider','app',function($httpProvider,app){
	//统一的请求拦截处理，包括本地的模板ajax请求
	$httpProvider.interceptors.push("securityInterceptor");
}]).run(['app',"$rootScope","$filter",function(app,$rootScope,$filter){
	var global = $rootScope.global = {
		isLogin : false,
		info : {}
	};

	app.filter = $filter;
}]);
/*
*通过constent定义一个常量服务
*/
myApp
.constant('app',{
	version : new Date().getTime(),
	canvasName : "winCanvas"
})
.config(['$stateProvider', '$urlRouterProvider','$locationProvider',
	function($stateProvider, $urlRouterProvider,$locationProvider){
		var index = {
			url : "/home",
			templateUrl : "index.html",
			controller : 'indexCtrl'
		},
		login = {
			url : "/login",
			templateUrl : "login.html",
			controller : 'loginCtrl'
		};

		$stateProvider
		.state("index",index)
		.state("login",login);

		$urlRouterProvider.otherwise('/login');
	}]);
/*
*公共的数据格式化方法，包括对数据的处理
*@auth xiaoming
*/

//删掉数组指定下标的元素
myApp.filter("curArry",function(){
	return function(arr,index){
		if (angular.isArray(arr)) {
			if (!isNaN(index)&&index<=arr.length) {
				for(var i=index;i<arr.length;i++){
					arr[i]=arr[i+1];
				}

				arr.length--;

				return arr;
			};
		};
	}
});
/*公共服务*/
myApp.factory("restAPI",["$resource",function($resource){
	var actions = {
		"post" : {
			method : "POST"
		},
		"get" : {
			method : "GET"
		}
	}

	return {
		unameCheck : $resource("/api/user/unameCheck",{},actions),
		userLogin : $resource("/api/user/userLogin",{},actions),
		uploadImg : $resource("/api/files/uploadImg",{},actions),
		getQiniuToken : $resource("/api/files/getQiniuToken",{},actions),
		getQiuniuFiles : $resource("/api/files/getQiuniuFiles",{},actions),
		getImageUrl : $resource("/api/files/getImageUrl",{},actions),
		deleteQiniuFiles : $resource("/api/files/deleteQiniuFiles",{},actions)
	}
}])
.factory("cache",["$cacheFactory",function($cacheFactory){
	return {
		user:$cacheFactory("user",{capacity:20})
	}
}]);

myApp.provider('securityInterceptor',function(){
	this.$get = function($location,$q){
		return function(promise){			
			return promise.then(null,function(response){
				if (response.resultCode=="1001") {
					$location.href="#home";
				}else{
					return response;
				}
			});
		}
	}
});
/*
*弹出框组件
*@params
*@author xiaoming
*/
myApp.factory("alert",function(){
	var defaults={
		type:"load"
	}

	function createDiv(type){
		var initDiv = "<div class='bd-alert'>";
		
		switch(type){
			case "load":{

			}
			break;
			case "comfirm":{

			}
			break;
			default:{

			}
			break;
		}

		initDiv+="</div>";

		return initDiv;
	}

	var alertDiv = function(){

	}
});
/*
*文件详情窗口
*/
myApp.service("fileDetail",function(){
	var count = 0;
	var content = "<div class='macWindow'><div";
	this.open = function(){
		if (count==0) {
			
		};
	}
});
/*
*macWindow公共服务,设置一个公共的类似mac系统的弹出窗口
*@params size {string:"lg"大、"xg"中等、"sg"小} 大小
*@params templateUrl {str} 里面视图模板的url地址
*@params title {string} 窗口的标题
*/
myApp.service("macwin",function(app,$http,$templateCache,$compile){
	var canvas = document.getElementById(app.canvasName);
	var ctx = canvas.getContext("2d");
	var maxIndex = 1;
	var startPosition = {},movePosition = {},doc = $(document);
	var dragMinWidth = 500;
	var dragMinHeight = 225;
	/**
	* 绘制形状
	* @param s1 {Number} 起点一
	* @param s2 {Number} 起点二
	* @param p1 {Number} 结束点一
	* @param p2 {Number} 结束点二
	*/
	function draw(s1, s2, p1, p2) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.moveTo(s1, 0);
		ctx.bezierCurveTo(s1, canvas.height * 0.2, p1, canvas.height * 0.6, p1, canvas.height);
		ctx.lineTo(p2, canvas.height);
		ctx.bezierCurveTo(p2, canvas.height * 0.6, s2, canvas.height * 0.2, s2, 0);
		ctx.lineTo(s1, 0);
		ctx.fillStyle = "rgba(0, 0, 0, .2)";
		ctx.fill();
	}
	/**
	* 擦除方式
	* @param y {Number}
	* @param speed {Number}
	* @param type 类型，放大或缩小 zoomin、zoomout
	*/
	function clearRect(y, speed, type) {
		if(type === "zoomout") {
			ctx.clearRect(0, y, canvas.width, speed);
		} else if(type === "zoomin") {
			ctx.clearRect(0, 0, canvas.width, y);
		}
	}
	/**
	* 缩放效果
	* @param s1 {Number} 起点一
	* @param s2 {Number} 起点二
	* @param p1 {Number} 结束点一
	* @param p2 {Number} 结束点二
	* @param type {String} 类型，放大或缩小 zoomin、zoomout
	*/
	function scale(s1, s2, p1, p2, type, callback) {
		var dist1 = Math.abs(p1 - s1);
		var dist2 = Math.abs(p2 - s2);
		var d1, d2, _p1, _p2, speed1, y, speed2;
		if(dist1 === 0 || dist2 === 0) {
			dist1 = 1;
			dist2 = 1;
		}
		speed1 = 50;
		speed2 = 50;
		if(type === "zoomout") {
			d1 = (p1 >= s1 && p1 < speed1) ? 0 : p1 < s1 ? -speed1 : speed1;
			d2 = p2 < s2 ? -speed1 * dist2 / dist1 : speed1 * dist2 / dist1;
			_p1 = s1;
			_p2 = s2;
			y = 0;
			var t = setInterval(function () {
				if(_p2 - _p1 <= p2 - p1) {
					clearInterval(t);
					var timer = setInterval(function () {
						if(y > canvas.height) {
							clearInterval(timer);
							callback && callback();
						}
						clearRect(y, speed2, type);
						y += speed2;
						speed2 += 1;
					}, 17);
				}
				draw(s1, s2, _p1, _p2);
				_p1 += d1;
				_p2 += d2;
				if((d1 < 0 && _p1 <= p1) || (d1 > 0 && _p1 >= p1)) {
					_p1 = p1;
				}
				if((d2 < 0 && _p2 <= p2) || (d2 > 0 && _p2 >= p2)) {
					_p2 = p2;
				}
			}, 17);
		} else if(type === "zoomin") {
			d1 = (p1 >= s1 && p1 < speed1) ? 0 : p1 < s1 ? speed1 : -speed1;
			d2 = p2 < s2 ? speed1 * dist2 / dist1 : -speed1 * dist2 / dist1;
			_p1 = p1;
			_p2 = p2;
			y = canvas.height;
			var timer = setInterval(function () {
				if(y <= 0) {
					clearInterval(timer);
					var t = setInterval(function () {
						if(_p2 - _p1 >= s2 - s1) {
							clearInterval(t);
							callback && callback();
							return
						}
						draw(s1, s2, _p1, _p2);
						_p1 += d1;
						_p2 += d2;
					}, 17);
				}
				draw(s1, s2, _p1, _p2);
				clearRect(y, speed2, type);
				y -= speed2;
				speed2 += 1;
			}, 17);
		}
	}

	function canvasEmotion(obj,picker){
		var isLock = obj.attr("isLock"); 
		if (isLock==="false") {
			var _this = $("#"+picker)[0];
			var pNode = $("#"+picker).parent();
			var pLeft = pNode[0].offsetLeft;

			var win = obj[0];

			obj.attr("isLock","true");

			canvas.width = document.body.offsetWidth;
			canvas.height = _this.parentNode.offsetTop - win.offsetTop;
			canvas.style.top = win.offsetTop + "px";
			canvas.style.zIndex = 1;
			win.style.visibility = "hidden";
			var s1 = win.offsetLeft;
			var s2 = win.offsetLeft + win.offsetWidth;
			var p1 = pLeft+_this.offsetLeft;
			var p2 = pLeft+_this.offsetLeft + _this.offsetWidth;

			var cname = _this.className;
			if(cname.indexOf("folded") === -1) {
				scale(s1, s2, p1, p2, "zoomout", function () {
					canvas.style.zIndex = -1;
					obj.attr("isLock","false");
				});
				_this.className = cname + "folded";
			} else {
				scale(s1, s2, p1, p2, "zoomin", function () {
					canvas.style.zIndex = -1;
					win.style.visibility = "visible";
					obj.attr("isLock","false");
					clearRect(canvas.height, 30, "zoomin");
				});
				_this.className = cname.replace("folded", "");
			}					
		}
	}

	function fixEvent(e,root){
		if (!e.pageX) {
            e.pageX = e.clientX + $(window).scrollTop();
            e.pageY = e.clientY + $(window).scrollLeft();
        }
        if (!e.layerX) {
            e.layerX = e.clientX - parseInt(root.css('left'));
            e.layerY = e.clientY - parseInt(root.css('top'));
        }
        return e;
	}

	/*-------------------------- +
	  改变大小函数
	 +-------------------------- */
	function resize(oParent, handle, isLeft, isTop, lockX, lockY)
	{
		var disX,disY,iParentTop,iParentLeft,iParentWidth,iParentHeight;

		var _resize = function(event){
			var event = event || window.event;
				
			var iL = event.clientX - disX;
			var iT = event.clientY - disY;
			var maxW = document.documentElement.clientWidth - oParent[0].offsetLeft - 2;
			var maxH = document.documentElement.clientHeight - oParent[0].offsetTop - 2;			
			var iW = isLeft ? iParentWidth - iL : handle[0].offsetWidth + iL;
			var iH = isTop ? iParentHeight - iT : handle[0].offsetHeight + iT;
				
			isLeft && (oParent[0].style.left = iParentLeft + iL + "px");
			isTop && (oParent[0].style.top = iParentTop + iT + "px");
				
			iW < dragMinWidth && (iW = dragMinWidth);
			iW > maxW && (iW = maxW);
			lockX || (oParent[0].style.width = iW + "px");
				
			iH < dragMinHeight && (iH = dragMinHeight);
			iH > maxH && (iH = maxH);
			lockY || (oParent[0].style.height = iH + "px");
				
			if((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) doc.unbind("mousemove",_resize);
				
			return false;
		},
		_resizeEnd = function(e){
			doc.unbind("mousemove",_resize).unbind("mouseup",_resizeEnd);

			return false;
		};

		handle.bind("mousedown",function(event){
			var event = event || window.event;
			disX = event.clientX - handle[0].offsetLeft;
			disY = event.clientY - handle[0].offsetTop;	
			iParentTop = oParent[0].offsetTop;
			iParentLeft = oParent[0].offsetLeft;
			iParentWidth = oParent[0].offsetWidth;
			iParentHeight = oParent[0].offsetHeight;
			
			doc.bind("mousemove",_resize).bind("mouseup",_resizeEnd);
			
			return false;
		});
	};

	function bindEvent(obj,picker){
		var _down = function(e){
			e = fixEvent(e,obj);

			startPosition = {
	            x: e.layerX,
	            y: e.layerY
	       	};

	       	doc.bind("mousemove",_move).bind("mouseup",_end);

	       	this.setCapture && this.setCapture(false); //ie 鼠标移出浏览器依然可以拖拽

			e.preventDefault(); //阻止默认行为，chrome的拖拽选择文字行为

			return false;
		},
		_move = function(e){
			e = fixEvent(e,obj);

			movePosition = {
	            x: e.clientX - startPosition.x,
	            y: e.clientY - startPosition.y
	        };

	        _limit();

	        obj.css({
	        	left: movePosition.x,
	            top: movePosition.y
	        });

	        return false;
		},
		_end = function(e){
			doc.unbind('mousemove', _move).unbind('mouseup', _end);

			return false;
		},
		_limit = function(){
			var max = {
				x:$(window).width()-obj.width()-5,
				y:$(window).height()-obj.height()-4
			}

			movePosition = {
				x: Math.max(0, movePosition.x),
                y: Math.max(0, movePosition.y)
			}

			movePosition = {
				x: Math.min(max.x, movePosition.x),
                y: Math.min(max.y, movePosition.y)
			}
		};

		obj.click(function(e){
			var cname = $(e.target)[0].className;

			if (cname.indexOf("glyphicon-remove")!==-1) {
				$("#"+picker).addClass("folded");
				obj.remove();
			}else if(cname.indexOf("glyphicon-minus")!==-1){
				canvasEmotion(obj,picker);
			}else if(cname.indexOf("glyphicon-unchecked")!==-1){
				obj.css({
					width:"100%",
					height:"100%",
					top:0,
					left:0
				});
			}
		});

		obj.find(".t").bind("mousedown",_down).bind('mouseup', function() {
            this.releaseCapture && this.releaseCapture();
        });

        var oL = obj.find(".resizeL");
		var oT = obj.find(".resizeT");
		var oR = obj.find(".resizeR");
		var oB = obj.find(".resizeB");
		var oLT = obj.find(".resizeLT");
		var oTR = obj.find(".resizeTR");
		var oBR = obj.find(".resizeBR");
		var oLB = obj.find(".resizeLB");

        //四角
		resize(obj, oLT, true, true, false, false);
		resize(obj, oTR, false, true, false, false);
		resize(obj, oBR, false, false, false, false);
		resize(obj, oLB, true, false, false, false);
		//四边
		resize(obj, oL, true, false, false, true);
		resize(obj, oT, false, true, true, false);
		resize(obj, oR, false, false, false, true);
		resize(obj, oB, false, false, true, false);

        obj.mousedown(function(){
        	setFrontest(obj);
        });
	}

	function setFrontest(obj){
		obj.css({
			"z-index":++maxIndex
		});
	}

	this.open = function(options){
		var defaults = {
			templateUrl:"<div>新窗口</div>",
			size:"lg",
			macId:"mac_"+new Date().getTime(),
			title:"新窗口",
			picker:"",
			scope:"",
		}
		
		angular.extend(defaults,options);

		if(!$("#"+defaults.macId).length){
			var winDiv = "<div class='macWindow' id='"+defaults.macId+"' style='visibility:hidden' isLock='false'>";
			winDiv+= '<div class="t"><div class="h-icon icon-r"><span class="glyphicon glyphicon-remove h-opIcon"></span></div><div class="h-icon icon-y"><span class="glyphicon glyphicon-minus h-opIcon"></span></div><div class="h-icon icon-b"><span class="glyphicon glyphicon-unchecked h-opIcon"></span></div>';
			winDiv+= '<div class="h-title">'+defaults.title+'</div></div>';
			winDiv+= '<div class="resize resizeL"></div><div class="resize resizeT"></div><div class="resize resizeR"></div><div class="resize resizeB"></div><div class="resize resizeLT"></div><div class="resize resizeTR"></div><div class="resize resizeBR"></div><div class="resize resizeLB"></div>';
			winDiv+= '<div class="c">';

			$http.get(defaults.templateUrl,{ cache: $templateCache, headers: { Accept: 'text/html' }})
			.then(function(response){
				winDiv+= response.data+"</div>";
				winDiv+= "</div>";

				var el = $compile(winDiv)(defaults.scope);

				$(".main").append(el);

				setFrontest($(winDiv));

				canvasEmotion($("#"+defaults.macId),defaults.picker);

				bindEvent($("#"+defaults.macId),defaults.picker);
			});
		}else{
			canvasEmotion($("#"+defaults.macId),defaults.picker);
		}
	}
})
/*
*封装一下下面那个菜单栏的动作,模拟出类似苹果的效果
*/
myApp.directive("menuOver",function(){
	return {
		link:function($scope, element, attrs){
			var imgLength = attrs.imgLength;
			var iWid = 128;
			var pItemLeft = $(element)[0].offsetLeft;
			var pItemTop = $(element)[0].offsetTop;

			$("*").mousemove(function(e){
				$(element).find("img").each(function(index,item){
					var selfItem = $(item)[0];

					var imgX = selfItem.offsetLeft +  pItemLeft + selfItem.offsetWidth / 2;
				  	var imgY = selfItem.offsetTop + pItemTop + selfItem.offsetHeight / 2;

				  	var a = imgX - e.clientX;
					var b = imgY - e.clientY;
					  
					var c = Math.sqrt(a*a+b*b);
					  
					var scale = 1 - c / 300;
					  
					if(scale<0.5){
						scale=0.5;
					}

					$(item).css("width",Math.ceil(iWid * scale));
				});
			});
		}
	}
});
myApp.controller('indexCtrl',['app','$scope',"macwin",function(app,$scope,macwin){
	$scope.testService = function(){
		macwin.open({
			size:"xg",
			macId:"testMac",
			title:"测试窗口",
			picker:"mail",
			templateUrl:"login.html",
			scope:$scope
		});
	}

	$scope.testService2 = function(){
		macwin.open({
			size:"xg",
			macId:"photo",
			title:"图片浏览",
			picker:"message",
			templateUrl:"imagePage.html",
			scope:$scope
		});
	}
}]);
/*
*图片操作的controller
*/
myApp.controller("imgpageCtr",['app','$scope',"restAPI",function(app,$scope,restAPI){
	$scope.imgList = [];
	$scope.unloading = false;
	//获取图片列表
	restAPI.getQiuniuFiles.post({bucketname:"zhugemaolu",limit:10},function(res){
		$scope.imgList = res.list;
	});

	$scope.loadStart = function(key){
		$scope.unloading = true;
	}

	$scope.loadProgress = function(key,per){
		$scope.$broadcast("pie",per);
	}

	$scope.loadComplete = function(data){
		restAPI.getImageUrl.get({key:data.key},function(res){
			data.url = res.url;

			$scope.unloading = false;
			$scope.imgList.push(data);
		});
	}

	$scope.deleteList = function(key){
		angular.forEach($scope.imgList,function(item,index){
			if (item.key==key) {
				$scope.imgList = app.filter("curArry")($scope.imgList,index);
			};
		});
	}
}]);
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
/*远程判断用户名是否存在*/
myApp.directive("validename",function(restAPI){
	return{
		require:'ngModel',
		link:function(scope,elem,attrs,ngModel){
			ngModel.$parsers.unshift(function(val){
				restAPI.unameCheck.get({name:val},function(data){
					if(data.msg){
						ngModel.$setValidity("validename",true);
					}else{
						ngModel.$setValidity("validename",false);
					}
				});

				return val;
			});
		}
	}
});
/*
* 登录的congtroller
*/
myApp.controller('loginCtrl',['app','$scope','restAPI','$location',function(app,$scope,restAPI,$location){
	$scope.user = {
		username : "",
		password : ""
	}

	$scope.subForm = function(isValid){
		if (isValid) {
			restAPI.userLogin.post($scope.user,function(res){
				if (res.resultCode=="0000") {
					$location.path("/home");
				}else{
					
				}
			});
		}

		return false;
	}
}]);

;(function(){

'use strict';

angular.module('genTemplates', []).run(['$templateCache', function($templateCache) {

  $templateCache.put('imagePage.html', '<div class="book-imgCon" ng-controller="imgpageCtr"><div class="btn-group btn-group-xs"><button type="button" class="btn btn-default"><span class="glyphicon glyphicon-th-list"></span></button> <button type="button" class="btn btn-default"><span class="glyphicon glyphicon-th"></span></button></div><ul class="book-imgUl" bindonce><li ng-repeat="uimg in imgList" img-control img-key="{{uimg.key}}"><img bo-src="uimg.url" alt> <a class="book-opration" ng-if="showOprate" ng-click="deleteImage()"><span class="glyphicon glyphicon-trash"></span></a></li><li ng-if="unloading"><circle></circle></li><li style="border:1px dotted #40B5DB"><label class="bk-uploader" for="uploadImg"><span class="glyphicon glyphicon-plus" style="top:23px;"></span></label></li></ul><input type="file" class="hide" id="uploadImg" up-loader="myFile"></div>');

  $templateCache.put('index.html', '<div class="book-manu" menu-over img-length="7"><img src="dist/img/mac/Finder.png" title="Finder" width="64px" ng-click="testService2()" id="message" class="folded"> <img src="dist/img/mac/Appstore.png" title="Appstore" width="64px"> <img src="dist/img/mac/Mail.png" title="Mail" width="64px" ng-click="testService()" id="mail" class="folded"> <img src="dist/img/mac/safari.png" title="safari" width="64px"> <img src="dist/img/mac/FaceTime.png" title="FaceTime" width="64px"> <img src="dist/img/mac/AddressBook.png" title="AddressBook" width="64px"> <img src="dist/img/mac/iCalendar.png" title="iCalendar" width="64px"></div><canvas id="winCanvas"></canvas>');

  $templateCache.put('login.html', '<div class="layout-login"><div class="book-container"><div class="book-top"><img src="/dist/img/logoBig.png" width="156" height="105" alt="我的angular网站"><p class="book-logo-name"><span>诸葛茅庐</span></p><p class="book-logo-littlename"><span>真实的项目成长记录平台</span></p></div><div class="book-form"><form ng-if="!global.isLogin" ng-submit="subForm(useForm.$valid)" name="useForm" novalidate><div class="form-group has-feedback" ng-class="{true:\'has-success\',false:\'has-error\'}[useForm.username.$valid]"><input class="form-control" placeholder="用户名" type="text" required ng-model="user.username" name="username" validename> <span class="glyphicon glyphicon-ok form-control-feedback" ng-if="useForm.username.$dirty&&useForm.username.$valid"></span> <span class="glyphicon glyphicon-remove form-control-feedback" ng-if="useForm.username.$dirty&&useForm.username.$invalid"></span></div><div class="form-group has-feedback" ng-class="{true:\'has-success\',false:\'has-error\'}[useForm.password.$dirty&&useForm.password.$valid]"><input class="form-control" placeholder="密码" type="password" required ng-model="user.password" name="password"> <span class="glyphicon glyphicon-ok form-control-feedback" ng-if="useForm.password.$dirty&&useForm.password.$valid"></span> <span class="glyphicon glyphicon-remove form-control-feedback" ng-if="useForm.password.$dirty&&useForm.password.$invalid"></span></div><button type="submit" class="btn btn-default btn-block btn-primary">登录</button></form><div ng-if="global.isLogin"><button class="btn btn-default btn-block btn-primary">{{global.user.name}}</button></div></div></div></div>');

}]);

})();