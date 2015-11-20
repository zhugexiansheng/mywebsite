/*
*文件上传组件
*/
myApp.directive("upLoader",["$parse","restAPI",function($parse,restAPI){
	return {
		link:function($scope, element, attrs){
			element.bind("change",function(event){
				var data = new FormData();
				console.log(element[0].files[0]);
				data.append("uploadFile",element[0].files[0]);

				restAPI.uploadImg.post(data,function(res){
					console.log(res);
				});
			});
		}
	}
}]);