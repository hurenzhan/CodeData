let agg = (function () {
	let index = 0,
		arr = [1,2,3],
		length = arr.length;
	return {
		next : function () {
			let element;
			if (!this.hasNext()) {
				return null;
			}
			element = arr[index];
			index++;
			return element;
		},
		hasNext : function () {
			return index < length;
		},
		rewind : function () {
			index = 0;
		}
	}
})();
console.log(agg.next());
console.log(agg.next());
console.log(agg.next());
console.log(agg.next());