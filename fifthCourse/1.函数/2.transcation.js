class Transaction {
  perform(anyMethod, wrappers) {
    wrappers.forEach(wrapper => wrapper.initialize())
    anyMethod()
    wrappers.forEach(wrapper => wrapper.close())
  }
}

let transaction = new Transaction()
let oldFn = () => {
  console.log("原有的逻辑")
}

transaction.perform(oldFn, [{
    initialize() {
      console.log("初始化");
    },
    close() {
      console.log("关闭");

    }
  },
  {
    initialize() {
      console.log("初始化2");
    },
    close() {
      console.log("关闭2");
    }
  }
])