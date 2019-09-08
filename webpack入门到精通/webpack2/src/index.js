import './index.css'

console.log('hello');

let logo = require('./images/qrcode.png')
let img = new Image()
img.src = logo;

document.body.appendChild(img)