// 如果函数的参数是函数 或者这个函数返回的是一个新的函数 我们就叫这个函数是高阶函数

// function test () { 
//   return function fn () {

//   }
// }

// AOP 面向切片编程
function say(who) {
  console.log(who + "hello");
}

// 基本上不会去破坏原函数
// 在 function 的原型上添加一个
Function.prototype.before = function (beforeFn) {
  return (...args) => {
    // this 指向的是 say 箭头函数中没有 this 也没有 arguments
    beforeFn()
    this(...args)
  }
}

// after 函数
Function.prototype.after = function (beforeFn) {
  return (...args) => {
    this(...args)
    beforeFn()
  }
}

// beforeSay 返回的是一个包装后的函数
let beforeSay = say.before(() => {
  console.log("开始说话");
})

beforeSay("我")
