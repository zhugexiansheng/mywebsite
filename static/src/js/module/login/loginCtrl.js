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
