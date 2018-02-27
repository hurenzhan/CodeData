let Visitor = {
	splice : function () {
		let args = [].splice.call(arguments,1);
		[].splice.apply(arguments[0],args);
	},
	push : function() {
		let arr = [];
		for (let obj in arguments[0]) {
			if (!arguments[0].hasOwnProperty(obj)) {
				arr.push(arguments[0][obj])
			}
		}
		let newagrs = arr.concat([].splice.call(arguments,1));
		[].push.apply(arguments[0],newagrs);
	}
}
let obj = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    length: 4
};
Visitor.push(obj, function(){}, [], {});
console.log(obj);