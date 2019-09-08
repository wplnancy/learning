const fs = require("fs").promises
async function read() { 
  let content = await fs.readFile('./name.txt', "utf8")
  
  let age = await fs.readFile(content, "utf8")
  let a = await age + 100;
  return a
 }

 read().then(data => {
   console.log("我是数据", data);
 })