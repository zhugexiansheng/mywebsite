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