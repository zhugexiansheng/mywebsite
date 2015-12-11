/*
*弹出框组件
*@params
*@author xiaoming
*/
myApp.factory("alert",function(){
	var defaults={
		type:"load"
	}

	function createDiv(type){
		var initDiv = "<div class='bd-alert'>";
		
		switch(type){
			case "load":{

			}
			break;
			case "comfirm":{

			}
			break;
			default:{

			}
			break;
		}

		initDiv+="</div>";

		return initDiv;
	}

	var alertDiv = function(){

	}
});