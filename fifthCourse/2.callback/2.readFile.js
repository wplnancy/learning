// node 方法  异步的 io
const fs = require("fs");

function after(times, callback) {
  let school = {};

  return function out(key, value) { 
    school[key] = value
    if (--times == 0) {
      callback(school)
    }
   }
}

// 局限性， 回调可能有很多个回调函数
let out = after(2, (school) => {
  console.log(school);
})

// trycatch 只能捕获同步的
// 异步的  异步代码会等待同步代码先执行完
// 如果都使用回调嵌回调的时候会等待之前的运行完成才可以再次执行该方法 所以是有问题的
fs.readFile('./name.txt', "utf-8", function (err, data) {
  out('name', data)
  // school.name = data
})


fs.readFile('./age.txt', "utf-8", function (err, data) {
  // console.log(data);
  out('age', data)
  // school.age = data
})

// function out() {
//   if(Object.keys(school).length == 3) {
//     console.log(school);
//   }
// }

// console.log(school);


console.log("hello");