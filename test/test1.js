//捕获字符串总的某一部分数据
var str = 'callback({"code":0,"name":"wangwei(malin)"})'

var reg = /^\w+\(({.*})\)$/
console.log(str.match(reg)[1]);
