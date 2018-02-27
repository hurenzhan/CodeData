window.requestAnimationFrame = window.requestAnimationFrame || function(fn){return setTimeout(fn,1000/60)};
window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

function tMove(obj,json,time,callback){
	var getStyle = obj.currentStyle || getComputedStyle(obj);
	var start = {},s = {};
	for(var key in json){
		start[key] = parseFloat(getStyle[key]);
		s[key] = json[key] - start[key];
		if(!s[key]){
			delete start[key];
			delete json[key];
		}
	}
	var startTime = new Date();
	(function fn(){
		var prop = (new Date() - startTime) / time;
		prop >= 1?prop = 1:requestAnimationFrame(fn);
		for(var key in start){
			if(key === "opacity"){
				var value = s[key] * prop + start[key];
				obj.style[key] = value;
				obj.style.filter = "alpha(opacity = "+value*100+")";
			}else{
				obj.style[key] = s[key] * prop + start[key] + "px";
			}
		}
		if(prop === 1){callback && callback()};
	})()
}
