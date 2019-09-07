const fs = require("fs");
// 发布 订阅 是一种一对多的关系  [fn, fn, fn]
// 希望两次都完成 分别答应最终结果 再打印一次处理完毕
class Events {
  constructor () {
    this.stack = []
  }
  on(fn) {
    this.stack.push(fn)
  }
  emit () {
    this.stack.forEach(callback => callback())
  }
}

let events = new Events()
let school = {}

events.on(function () {
  if (Object.keys(school).length == 2) {
    console.log(school);
  }
})

events.on(function () {
  console.log("处理完毕");
})

fs.readFile('./name.txt', "utf-8", function (err, data) {
  school.name = data;
  events.emit()
})


fs.readFile('./age.txt', "utf-8", function (err, data) {
  school.age = data;
  events.emit()
})

// 观察者模式 他是基于发布订阅模式  
// 发布和订阅 两者之间没有直接关系
// 观察者模式 被观察的 观察者 vue
// 把观察者放到观察者中
// 小宝宝 很开心 把我放到小宝宝内部 小宝宝不开心了 会通知我和他不开心了