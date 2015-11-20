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
		uploadImg : $resource("/api/files/uploadImg",{},actions)
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