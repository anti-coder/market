let express = require('express'); //подключаем модуль express
let app = express(); //создали новый экземпляр класса express
const data = '12345';

app.listen(8089, function () {   //слушаем порт 3000
  console.log('node express work on 8089');
});

app.use(express.json()); // установили метод express.json


app.get('/', function (request, response) { 

  response.send(data)
});