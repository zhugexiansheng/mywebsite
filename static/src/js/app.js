/*
* angularjs的主要入口
*/
var myApp = angular.module("myApp",["ui.router","ngCookies","ngAnimate",'ngResource',"genTemplates",'pasvaz.bindonce']);

myApp.config(['$httpProvider','app',function($httpProvider,app){
	//统一的请求拦截处理，包括本地的模板ajax请求
	$httpProvider.interceptors.push("securityInterceptor");
}]).run(['app',"$rootScope","$filter",function(app,$rootScope,$filter){
	var global = $rootScope.global = {
		isLogin : false,
		info : {}
	};

	app.filter = $filter;
}]);