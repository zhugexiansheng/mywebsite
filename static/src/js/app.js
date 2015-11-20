/*
* angularjs的主要入口
*/
var myApp = angular.module("myApp",["ui.router","ngCookies","ngAnimate",'ngResource',"genTemplates"]);

myApp.config(['$httpProvider','app',function($httpProvider,app){
	//统一的请求拦截处理，包括本地的模板ajax请求
	$httpProvider.interceptors.push("securityInterceptor");
}]).run(['app',"$rootScope",function(app,$rootScope){
	var global = $rootScope.global = {
		isLogin : false,
		info : {}
	};
}]);