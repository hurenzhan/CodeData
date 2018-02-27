function obj(name,val) {
    return new this[name](val);
}
obj.prototype = {
    obj1 : function(val){
        this.a = 'obj1的函数变量';
        console.log(this.a);
        console.log('传值'+val);
    },
    obj2 : function(val){
        this.a = 'obj2的函数变量';
        console.log(this.a);
        console.log('传值'+val);
    },
    obj3 : function(val){
        this.a = 'obj3的函数变量';
        console.log(this.a);
        console.log('传值'+val);

    }
};
new obj('obj1','1');
new obj('obj2','2');
new obj('obj3','3');
