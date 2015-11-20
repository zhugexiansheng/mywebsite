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

	var startPosition = {},movePosition = {},doc = $(document);

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

        obj.mousedown(function(){
        	setFrontest(obj);
        });
	}

	function setFrontest(obj){
		obj.css({
			"z-index":++maxIndex
		});
	}

	var defaults = {
		templateUrl:"<div>新窗口</div>",
		size:"lg",
		macId:"mac_"+new Date().getTime(),
		title:"新窗口",
		picker:"",
		scope:"",
	}

	this.open = function(options){
		angular.extend(defaults,options);

		if(!$("#"+defaults.macId).length){
			var winDiv = "<div class='macWindow' id='"+defaults.macId+"' style='visibility:hidden' isLock='false'>";
			winDiv+= '<div class="t"><div class="h-icon icon-r"><span class="glyphicon glyphicon-remove h-opIcon"></span></div><div class="h-icon icon-y"><span class="glyphicon glyphicon-minus h-opIcon"></span></div><div class="h-icon icon-b"><span class="glyphicon glyphicon-unchecked h-opIcon"></span></div>';
			winDiv+= '<div class="h-title">'+defaults.title+'</div></div>';
			winDiv+= '<div class="c">';

			$http.get(defaults.templateUrl,{ cache: $templateCache, headers: { Accept: 'text/html' }})
			.then(function(response){
				winDiv+= response.data+"</div>";
				winDiv+= "</div>";

				var el = $compile(winDiv)(defaults.scope);

				$("body").append(el);

				setFrontest($(winDiv));

				canvasEmotion($("#"+defaults.macId),defaults.picker);

				bindEvent($("#"+defaults.macId),defaults.picker);
			});
		}else{
			canvasEmotion($("#"+defaults.macId),defaults.picker);
		}
	}
})