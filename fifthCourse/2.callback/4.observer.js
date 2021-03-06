// 观察者模式
class Subject { // 被观察者
  constructor (){
    this.stack = []
    this.state = "开心"
  }

  attach (observer) {
    this.stack.push(observer)
  }

  setState (newState) {
    this.state = newState;
    this.stack.forEach(o => {
      o.update(newState)
    })
  }
}

class Observer { // 观察者
  constructor (name) {
    this.name = name;
  }

  update  (newState){
    console.log(`${this.name}: 小宝宝 ${newState}`);
  }
}

let o1 = new Observer("爸爸")
let o2 = new Observer("妈妈")

let subject = new Subject("小宝宝")

subject.attach(o1)
subject.attach(o2)

subject.setState("不开心")