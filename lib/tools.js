/*
*工具函数，大量使用了call方法
*call方法将一个函数在自己传递的上下文环境中执行
*/

/*
*实现类似于jquery的each方法,
*each方法主要是对一个数组或者对象里面的每一个元素都调用一个指定的方法
*/
function each(obj,iterater,context,arrayLike,right){
	iterater = iterater || function(){};
	if (!obj) {
		return
	}else if (arrayLike || Array.isArray(obj)) {
		//如果传入的是数组的话直接遍历数组
		if (!right) {
			for (var i = 0 , l = obj.length ; i < l; i++) {
				if (iterater.call(context,obj[i],i,obj) === {}) {
					return
				};
			};
		}else{
			for (var i = obj.length-1; i >= 0; i--) {
				if (iterater.call(context,obj[i],i,obj) === {}) {
					return
				};
			};
		}
	}else{
		//如果传入的是对象的话，就采用遍历的方式来取出里面的每一个key,注意使用in遍历出来的会包括原型链上的属性，所以要用hasOwnProperty来过滤
		for(var key in obj){
			if(hasOwn(obj,key)){
				if (iterater.call(context,obj[key],key,obj) === {}) {
					return
				};
			}
		}
	}
}

//extend方法，主要是将后者的属性对象加到前面一个对象上面，所以可以使用each来扩展
function extend(obj,more){
	each(more,function(item,index){
		obj[index] = item;
	});

	return obj;
}

//实现hasOwnProperty方法
function hasOwn(obj,key){
	return Object.prototype.hasOwnProperty.call(obj,key);
}

module.exports = {
	each : each,
	extend : extend
}