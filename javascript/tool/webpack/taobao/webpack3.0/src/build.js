import css from './assets/css/index.css';
document.getElementById('title').innerHTML = 'Hello webpack!!!';
var imgUrl = require('./assets/images/6a0dcbfag74a575f40177&690&690.jpg');
var imgHtml = '<img src="'+imgUrl+'">';
document.getElementById('title').innerHTML = imgHtml;

const json = require('./tsconfig.json');
// document.getElementById('json').innerHTML = json.name;

$("#json").html(json.name)

import add from "./add.js";
console.log(add(1,2))
console.log(add(1,2))