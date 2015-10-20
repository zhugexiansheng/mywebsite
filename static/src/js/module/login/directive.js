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