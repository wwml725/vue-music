let str = 'callback({"code:0,"data:{"name":"wangwei"}})';
let reg = /^\w+\(({[^()]+})\)$/
console.log(str.match(reg)[1]);

//正则练习
//
// let str1 = 'aaa';
// let reg1 = /^aa$/;
// console.log(str1.match(str1));

