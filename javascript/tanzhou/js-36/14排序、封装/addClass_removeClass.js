function addClass(obj,cName){
	var arr = obj.className.split(" ").concat(cName.split(" "));
	for (var i=0;i<arr.length;i++) {
		for (var j=arr.length-1;j>i;j--) {
			(arr[j] == " ")&&arr.splice(j,1);
			(arr[i] == arr[j])&&arr.splice(j,1);
		}
	}
	obj.className = arr.join(" ");
}
function removeClass(obj,cName){
	var arr = obj.className.split(" ");
	var arrM = cName.split(" ");
	for (var i=0;i<arrM.length;i++)for(var j=arr.length-1;j>0;j--)(arrM[i] == arr[j])&&arr.splice(j,1);
	obj.className = arr.join(" ");
}