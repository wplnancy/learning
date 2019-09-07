function after (times, callback) {
  return function () {
    if(--times == 0) {
      callback()
    }
  }
}

let fn = after(3, () => {
  console.log("执行3次后才执行");
})

// 实现 fn 执行 3 次之后才开始执行后面的回调函数
fn()
fn()
fn()