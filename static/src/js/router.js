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