let express = require('express'); //подключаем модуль express
let app = express(); //создали новый экземпляр класса express
const data = 'слушаем порт 3000 в командной строке';
const brow = 'ответ браузера'
let utc = new Date();


app.listen(3000, function () {   //слушаем порт 3000
  console.log(utc);
  console.log(data);
});

app.use(express.json()); // установили метод express.json


app.get('/', function (request, response) { 
  response.send(brow)
});