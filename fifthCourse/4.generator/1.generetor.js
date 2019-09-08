// 生成器 => 迭代器
// 会暂停函数执行
// function * read() {
//   try {
//     console.log(111);
//     yield 1;
//     console.log(222);
//     yield 2
//     console.log(333);
//     return undefined
//   } catch (error) {
//     console.log(error);
//   }
// }

// let it = read(); // iterteor
// console.log(it.next());
// it.throw("出错了")
// console.log(it.next());
// console.log(it.next());

// function  * buy(params) {
//   let a = yield 1;
//   console.log(a);
//   let b = yield 2;
//   console.log(b);
//   return b;
// }

// // 获取迭代器
// let it = buy()
// it.next("hello"); // 第一次传递参数是无效的
// it.next("world")
// it.next("珠峰")


// 先读取 name.txt  然后再读取 age.txt
// generator 配合 promise 使用
// 将 fs 的异步方法转换为 promise
const fs = require("fs").promises

function* read() {
  try {
    let content = yield fs.readFile("./name.txt", "utf8")
    console.log("内容", content);
    let age = yield fs.readFile(content, "utf8")
    return age;
  } catch (error) {
    console.log(error);
  }
}

// let it = read();
// let {
//   value,
//   done
// } = it.next()

// co 库

function co(it) {
  return new Promise((resolve, reject) => {
    // 异步迭代 next
    function next(data) {
      let {value, done} = it.next()
      if(!done) {
        Promise.resolve(value).then(data => {
          next(data)
        }, reject)
      } else {
        resolve(value); // 最终设置状态为成功
      }
    }
    next()
  })
}


co(read()).then(data => {
  // 我是返回的数据
  console.log(data);
})

// value.then((data) => {
//   console.log(data);
//   let {value, done} = it.next(data); // 将上一次执行的结果传递到下一层
//   value.then(data => {
//      let {
//        value,
//        done
//      } = it.next(data);
//      console.log(value);
//   })
// }).catch((err) => {
//   console.log(err);
//   it.throw(err)  
// });

// promise 要通过 then 但是 generator 可以省去 更加像同步的写法


// async 和 await 就是 generator + co 库

// 使用 await Promise.all()  实现等待多个 promise 完成
