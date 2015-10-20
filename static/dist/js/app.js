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
/*
*通过constent定义一个常量服务
*/
myApp
.constant('app',{
	version : new Date().getTime()
})
.config(['$stateProvider', '$urlRouterProvider','$locationProvider',
	function($stateProvider, $urlRouterProvider,$locationProvider){
		var index = {
			url : "/home",
			templateUrl : "index.html",
			controller : 'indexCtrl'
		},
		login = {
			url : "/login",
			templateUrl : "login.html",
			controller : 'loginCtrl'
		};

		$stateProvider
		.state("index",index)
		.state("login",login);

		$urlRouterProvider.otherwise('/login');
	}]);
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
myApp.controller('indexCtrl',['app','$scope',function(app,$scope){
	
}]);
/*远程判断用户名是否存在*/
myApp.directive("validename",function(restAPI){
	return{
		require:'?ngModel',
		link:function(scope,elem,attrs,ngModel){
			ngModel.$parsers.unshift(function(val){
				restAPI.unameCheck.get({name:val},function(data){
					if(data.msg){
						ngModel.$setValidity("validename",true);
						return val;
					}else{
						ngModel.$setValidity("validename",false);
						return undefined;
					}
				});
			});
		}
	}
});
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

;(function(){

'use strict';

angular.module('genTemplates', []).run(['$templateCache', function($templateCache) {

  $templateCache.put('index.html', '');

  $templateCache.put('login.html', '<div class="layout-login"><div class="book-container"><div class="book-top"><img src="/dist/img/logoBig.png" width="156" height="105" alt="我的angular网站"><p class="book-logo-name"><span>诸葛茅庐</span></p><p class="book-logo-littlename"><span>真实的项目成长记录平台</span></p></div><div class="book-form"><form ng-if="!global.isLogin" ng-submit="subForm(useForm.$valid)" name="useForm" novalidate><div class="form-group has-feedback" ng-class="{true:\'has-success\',false:\'has-error\'}[!useForm.name.$error.validename]"><input class="form-control" placeholder="用户名" type="text" required ng-model="user.name" name="name" validename> <span class="glyphicon glyphicon-ok form-control-feedback" ng-if="useForm.name.$dirty&&!useForm.name.$error.validename"></span> <span class="glyphicon glyphicon-remove form-control-feedback" ng-if="useForm.name.$dirty&&useForm.name.$error.validename"></span></div><div class="form-group has-feedback" ng-class="{true:\'has-success\',false:\'has-error\'}[useForm.password.$dirty&&useForm.password.$valid]"><input class="form-control" placeholder="密码" type="password" required ng-model="user.password" name="password"> <span class="glyphicon glyphicon-ok form-control-feedback" ng-if="useForm.password.$dirty&&useForm.password.$valid"></span> <span class="glyphicon glyphicon-remove form-control-feedback" ng-if="useForm.password.$dirty&&useForm.password.$invalid"></span></div><button type="submit" class="btn btn-default btn-block btn-primary">登录</button></form><div ng-if="global.isLogin"><button class="btn btn-default btn-block btn-primary">{{global.user.name}}</button></div></div></div></div>');

}]);

})();