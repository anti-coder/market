let express = require('express'); //подключаем модуль express
let app = express(); //создали новый экземпляр класса express
const data = 'node express work on 3000';

app.listen(3000, function () {   //слушаем порт 3000
  console.log('работает');
});

app.use(express.json()); // установили метод express.json


app.get('/', function (request, response) { 

  response.send(data)
});