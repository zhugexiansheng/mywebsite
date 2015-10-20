/*
* 登录的congtroller
*/
myApp.controller('loginCtrl',['app','$scope','restAPI',function(app,$scope,restAPI){
	$scope.user = {
		name : "",
		password : ""
	}

	$scope.subForm = function(isValid){
		console.log(1111,isValid);
		if (isValid) {
			console.log($scope.user);
		}

		return false;
	}
}]);
