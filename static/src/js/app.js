/*
* angularjs的主要入口
*/
var myApp = angular.module("myApp",["ui.router","ngCookies","ngAnimate",'ngResource',"genTemplates"]);

myApp.config(['$httpProvider','app',function($httpProvider,app){
	//在每个请求发生时都加入一个处理函数
	$httpProvider.defaults.transformRequest.push(function(data){
		return data;
	});

	//请求返回时的数据处理
	$httpProvider.defaults.transformResponse.push(function(data){
		return data;
	});

	//统一的请求拦截处理，包括本地的模板ajax请求
	$httpProvider.interceptors.push(function(){
		return {
			response: function (res) {
				var error, data = res.data;
				if (angular.isObject(data)) {
					app.timestamp = data.timestamp;
					error = !data.ack && data.error;
				}
				if (error) {
					app.toast.error(error.message, error.name);
					return app.q.reject(data);
				} else {
					return res;
				}
			},
			responseError: function (res) {
				var data = res.data || res,
				status = res.status || '',
				message = data.message || (angular.isObject(data) ? 'Error!' : data);

				app.toast.error(message, status);
				return app.q.reject(data);
			}
		};
	});
}]).run(['app',"$rootScope",function(app,$rootScope){
	var global = $rootScope.global = {
		isLogin : false,
		info : {}
	}
}]);