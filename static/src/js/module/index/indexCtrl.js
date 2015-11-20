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