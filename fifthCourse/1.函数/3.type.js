// 判断函数的数据类型
const isType = (type) => { // type 被私有化了
  return (content) => {
    return Object.prototype.toString.call(content) == `[object ${type}]`;
  }
  // return Object.prototype.toString.call(content) == `[object ${type}]`;
}

// isString isArray isBoolean
let flag = isType("hello", "string")
let types = ["String", "Boolean", "Number", "Null", "Undefined"]
let utils = {}

// 批量产出函数
for(let i = 0; i < types.length; i++) {
  utils["is" + types[i]] = isType(types[i]); // isType 是一个高阶函数
}

console.log(utils.isNumber("hello"));
console.log(utils.isNumber(2342));

// 如何实现柯里化函数

function fn (a) {
  return function(b) {
    return function (c) { 

     }
  }
}

// 偏函数