let obj  = (function(){
    let objVal = {
        a : '变量a的值',
        b : '变量b的值',
        fn : function(){
            console.log('fn的值');
        }
    };
    return {
        getData : function(val) {
            return objVal[val]
        }
    }
})()
obj.getData('fn')();
