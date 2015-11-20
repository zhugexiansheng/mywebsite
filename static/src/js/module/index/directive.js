/*
*封装一下下面那个菜单栏的动作
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