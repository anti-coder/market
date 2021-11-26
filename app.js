let express = require('express'); //подключаем модуль express
let app = express(); //создали новый экземпляр класса express
const data = 'node express work on 3000';
let utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');


app.listen(3000, function () {   //слушаем порт 3000
  console.log('Обновлено 17-10');
  console.log(data);
});

app.use(express.json()); // установили метод express.json


app.get('/', function (request, response) { 
  console.log(utc);
  console.log(data);
  response.send(utc)
});