/**
 * Created by wulv on 2017/3/23.
 */
const sql = require('./mysql');

let fn = function (onedata,i){
    return new Promise(function (resolve,reject){
        sql('SELECT * FROM nav where leve = 2 and navid = ?',[onedata[i]['navid']],(err,towdata) => {
            onedata[i].child = towdata;
            resolve()
        });
    })
};
module.exports = function (cb){
    sql('SELECT * FROM nav where leve = 1',(err,onedata) => {
        let arr = [];
        for(let i in onedata){
            arr[i] = fn(onedata,i);
            //console.log(arr);
        }
        Promise.all(arr).then(function (){
            cb(onedata);
        })
    });
};
