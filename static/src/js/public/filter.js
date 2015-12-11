/*
*公共的数据格式化方法，包括对数据的处理
*@auth xiaoming
*/

//删掉数组指定下标的元素
myApp.filter("curArry",function(){
	return function(arr,index){
		if (angular.isArray(arr)) {
			if (!isNaN(index)&&index<=arr.length) {
				for(var i=index;i<arr.length;i++){
					arr[i]=arr[i+1];
				}

				arr.length--;

				return arr;
			};
		};
	}
});