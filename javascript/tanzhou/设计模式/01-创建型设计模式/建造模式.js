function Human (param) {
    this.name = param || '保密';  //姓名
}
Human.prototype.getName = function () {
    return this.name;
}
function Work (work) {  //技能
    let obj = {
        "code" : function () {
            this.work = '工程师';
            this.workDescript = '每天沉迷于编程';
        },
        "UI" : function () {
            this.work = '设计师';
            this.workDescript = '设计是一种态度';
        },
        "teach" : function () {
            this.work = '教师';
            this.workDescript = '分享也是一种快乐';
        }
    }
    obj[work] && ( obj[work].call(this),1 ) || ( this.work = '没有该职位' );
};
function Person (name,work) {
    let _Person = new Human(name);
    _Person.work = new Work(work);
    return _Person;
}
console.log(Person('hurenfa','code')['work'].workDescript);
