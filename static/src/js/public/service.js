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
		unameCheck : $resource("/api/user/unameCheck",{},actions)
	}
}]);