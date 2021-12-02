let express = require('express'); //подключаем модуль express
let app = express(); //создали новый экземпляр класса express
let cookieParser = require('cookie-parser');// подключаем модуль для настройки файлов куки
let admin = require('./admin.js');// обратились к admin.js
let mysql = require('mysql'); //Подключаем mysql модуль (база данных)
let nodemailer = require('nodemailer'); //подключили модуль nodemailer
let utc = new Date();

app.use(express.static('public')); //подключение статических файлов из папки public
app.set('view engine', 'pug');  //задаем шаблонизатор pug, подключили шаблоны pug в папке view

let con = mysql.createConnection({ //настраиваем mysql модуль (база данных)
  host: '5.188.42.115',
  user: 'julia',
  password: '1313',
  database: 'ishop'
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //отключение проверки авторизации при работе локально

app.listen(3000, function () {   //слушаем порт 3000
  console.log('подключили node с базой данных на порту 3000');
  console.log(utc);
});
app.use(express.json()); // установили метод express.json
app.use(express.urlencoded()); // чтобы получать чистые данные из POST, чтобы не нужен был login.js 
app.use(cookieParser()); //чтобы достучаться до куки-парсера

app.use(function (request, responce, next) {
if (request.originalUrl == '/admin' || request.originalUrl == '/admin-order') {
admin(request, responce, con, next);
  }
else {
next();
 }
});

/* выводим товар на страницу, так делаем если один запрос(без названия категорий и т.п.), один вывод, иначе нужен Promice 
app.get('/', function (request, responce) { //get-запрос (через адресную строку) к базе данных, таблице товаров goods, get - метод express
  con.query(        /*обращаемся к переменной базы данных con методом query
    'SELECT * FROM goods', //goods - таблица товаров
    function (error, result) {
      if (error) throw error; //если ошибка, то бросаем исключение, и останавливаем программу
      ///  console.log(result); //выводится массив в формате RowDataParket
      //чтобы найти нужный id нужно перебрать весь объект и искать совпадение по id
      /*
      массив индексируем, ключ массива совпадает с id товара, не нужно перебирать весь объект товара
      
      let goods = {};
      //перепаковка массива, делаем индексацию удобной 
      for (let i = 0; i < result.length; i++) {
        goods[result[i]['id']] = result[i];
      }
      //console.log(goods);
      console.log(JSON.parse(JSON.stringify(goods))); //преобразовали объект в строку, распарсили JSON-строку => избавились от 'RowDataParket'
      responce.render('main', {  //подключили файл main.pug - верстка главной страницы, передаем данные в html
        //а данные на главную страницу берем отсюда:
        foo: 'hello',
        bar: 7,
        goods: JSON.parse(JSON.stringify(goods))
      });
    });
});
*/


app.get('/', function (request, responce) { //вызов главной страницы localhost:3000
  let cat = new Promise(function (resolve, reject) {
    con.query(
      "select id, slug, name, cost, image, category from (select id,slug,name,cost,image,category, if(if(@curr_category != category, @curr_category := category, '') != '', @k := 0, @k := @k + 1) as ind   from goods, ( select @curr_category := '' ) v ) goods where ind < 999",
      function (error, result, field) {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
  let catDescription = new Promise(function (resolve, reject) {
    con.query(
      "SELECT * FROM category",
      function (error, result, field) {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
  Promise.all([cat, catDescription]).then(function (value) {
  //  console.log(value[1]);
    responce.render('index', {
      goods: JSON.parse(JSON.stringify(value[0])),// данные о товарах в виде массива передали в index.pug, value[0] - массив goods
      cat: JSON.parse(JSON.stringify(value[1])),// данные о товарах в виде массива передали в index.pug, value[1] - массив cat
    });
  });
});


app.get('/cat', function (request, responce) { //sort.pug str.15
   //get-запрос (через адресную строку) к базе данных, таблице категорий cat
  let catId = request.query.id; //срабатывает при выборе категории
//  console.log(catId);
/*responce.render('cat', {}); //подключили файл cat.pug - верстка страницы категорий товаров,

 con.query(                        //запрос на сервер **** вместо него промисы
    'SELECT * FROM category WHERE id='+catId,
    function(error, result){
      if (error) throw error; // если ошибка, то кидаем исключение и останавливаем программу
      console.log(JSON.parse(JSON.stringify(result)));
   responce.render('cat', {
          foo: 'hello!!!!!',
          bar: 177,
          goods :  JSON.parse(JSON.stringify(goods)) // данные о товарах в виде массива передали в pug, goods - название массива 
      });   
});
*/

  let cat = new Promise(function (resolve, reject) { //выводим асинхронно  всё из таблицы категорий
    con.query(
      'SELECT * FROM category WHERE id=' + catId,
      function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
  });
  
  let goods = new Promise(function (resolve, reject) { //выводим асинхронно  всё из таблицы товаров
    con.query(
    //  'SELECT * FROM goods WHERE cost > 100000 AND category=' + catId,
    //  'SELECT * FROM goods WHERE category=' + catId,

'SELECT * FROM goods WHERE category ="' + catId + '" ORDER BY cost',

      function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
  });

  let = Promise.all([cat, goods]).then(function (value) { // массив категорий и товаров, сработает когда выведутся все товары и все категории 
    
    responce.render('cat', {    //подключили файл cat.pug - верстка страницы категорий товаров,
      cat: JSON.parse(JSON.stringify(value[0])),   //cat
      goods: JSON.parse(JSON.stringify(value[1]))  //goods
    });
     // console.log(value[0]);
     //  console.log(value[1]);
  //  console.log(cat);
  })
});


//то же (str.96-148) с DESC
app.get('/catDesc', function (request, responce) { //sort.pug str.18
   
  let catId = request.query.id;
  //console.log(catId);
  let cat = new Promise(function (resolve, reject) { //выводим асинхронно  всё из таблицы категорий
    con.query(
      'SELECT * FROM category WHERE id=' + catId,
      function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
  });
  
  let goods = new Promise(function (resolve, reject) { //выводим асинхронно  всё из таблицы товаров
    con.query(
    
'SELECT * FROM goods WHERE category ="' + catId + '" ORDER BY cost DESC',

      function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
  });

  let = Promise.all([cat, goods]).then(function (value) { // массив категорий и товаров, сработает когда выведутся все товары и все категории 
      responce.render('cat', {    //подключили файл cat.pug - верстка страницы категорий товаров,
      cat: JSON.parse(JSON.stringify(value[0])),   //cat
      goods: JSON.parse(JSON.stringify(value[1]))  //goods
    });
    //  console.log(value[0]);
    //  console.log(cat);
  });
});


//Сортировка по бренду (и по категории)
app.get('/catBrendSort', function (request, responce) { //sort.pug str.26
  let catId = request.query.id;
 // console.log(catId);

  let cat = new Promise(function (resolve, reject) { //выводим асинхронно  всё из таблицы категорий
    con.query(
      'SELECT * FROM category WHERE id=' + catId,
      function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
  });
  

  let goods = new Promise(function (resolve, reject) { //выводим асинхронно  всё из таблицы товаров
   
    con.query(
   'SELECT * FROM goods WHERE category ="' + catId + '" ORDER BY brend',
  
      function (error, result) {
        if (error) reject(error);
        resolve(result);
  //    console.log(result);
      });
  });


  let = Promise.all([cat, goods]).then(function (value) { // массив категорий и товаров, сработает когда выведутся все товары и все категории 
      responce.render('cat', {    //подключили файл cat.pug - верстка страницы категорий товаров,
      cat: JSON.parse(JSON.stringify(value[0])),   //cat
      goods: JSON.parse(JSON.stringify(value[1]))  //goods
    });
    //  console.log(value[0]);   // массив объектов - категории
    //  console.log(value[1]); // массив объектов - товары
  });
});



//Выбор бренда (и категории)
app.post('/brend', function (request, response) { //nav.js str.127

  let brendId = request.body.brend;
  let catId = request.body.category;
  //console.log(request.body);
  //console.log(brendId);
  //console.log(catId);  

  con.query('SELECT * FROM goods WHERE category ="' + catId + '" AND brend ="' + brendId + '" ORDER BY cost',

      function (error, result) {
        if (error) reject(error);
        let goods = {};
      for (let i = 0; i < result.length; i++){
      goods[result[i]['id']] = result[i];  // перепаковка массива
      }
        response.json(result);
  ///      console.log(result);
      });

});




/*
//выводим карточку одного товара
app.get('/goods', function (request, responce) {//get-запрос к базе данных, таблице товаров 
  console.log(request.query.id);
  con.query('SELECT * FROM goods WHERE id=' + request.query.id, function (error, result, fields) {
    if (error) throw error;
    responce.render('goods', { goods: JSON.parse(JSON.stringify(result)) });
  });
}); 
*/


// выводим карточку одного товара с красивым адресом и дополнительными картинками
app.get('/goods/*', function (request, responce) {
//  console.log('work');
//  console.log(request.params);
  con.query('SELECT * FROM goods WHERE slug="' + request.params['0'] + '"', function (error, result, fields) {
    if (error) throw error;
 //   console.log(result);
    result = JSON.parse(JSON.stringify(result));
//    console.log(result[0]['id']);
    con.query('SELECT * FROM images WHERE goods_id=' + result[0]['id'], function (error, goodsImages, fields) {
      if (error) throw error;
//      console.log(goodsImages);
      goodsImages = JSON.parse(JSON.stringify(goodsImages));
      responce.render('goods', { goods: result, goods_images: goodsImages });
    });
  });
});




// список категорий товаров
app.post('/get-category-list', function (request, response) { //nav.js str.23
//   console.log(request.body); //тело запроса, то, что получает нода в качестве входных параметров
    con.query('SELECT id, category FROM category', function (error, result, fields) {  //из таблицы категорий берем id и название категории
    if (error) throw error;
//    console.log(result);  
    response.json(result); //responce.json - метод, который преобразует наш ответ в json-строку, 
    //result - то, что получаем в результате выборки
  });
});


// список брендов
app.post('/get-brend-list', function (request, responce) { //nav.js str.86
   
    con.query('SELECT DISTINCT brend FROM goods',

      function (error, result) {
        if (error) reject(error);
        responce.json(result);
  //      console.log(result);
      });

});


//выводим корзину товаров на страницу site_header.pug str.45
app.get('/cart', function (request, responce) {
  responce.render('cart'); //-------------------------- cart.js str 59
});


//заполняем корзину товаров
app.post('/get-goods-info', function (request, responce) {  //-----------cart.js str 67
 // fetch из cart.js str 73
//  console.log(request.body.key);  //request.body - массив, то, что мы получли от cart.js str 67 //****************
  if (request.body.key.length !=0){
    con.query('SELECT id, name, slug, image, cost FROM goods WHERE id IN ('+request.body.key.join(',')+')', function (error, result, fields) {
      if (error) throw error;
  //   console.log(result);
      let goods = {};
      for (let i = 0; i < result.length; i++){
      goods[result[i]['id']] = result[i];  // перепаковка массива
      }
    responce.json(goods);
  //  console.log(goods);  //****************
  //  console.log('****************');  //****************
   });
 }
 else{
  responce.send('0');
  
 }
});


//для входа в кабинет покупателя, site_heder.pug str.38
app.get('/register', function (request, response) {//отправляем пользователю форму для заполнения register.pug
  response.render('register');
  });

//регистрация нового пользователя, принимаем заполненную форму
app.post('/register', function(request, response){ // fetch-запрс от register.js принимаем на сервере
  // fetch из register.js str 105

if(!request.body) return response.sendStatus(400);
  console.log(request.body); // request.body - то, что мы получли от register.js  
  //console.log(request.body.login, request.body.password);

   con.query(
   'SELECT COUNT(*) FROM user_info WHERE login ="' + request.body.login + '" AND password ="' + request.body.password + '" ',
  
      function (error, result) {
        if (error) reject(error);
   //     console.log(result[0]);
    //    for (let kay in result[0]) {console.log(kay)};
        for (let kay in result[0]) {
          let distinct = result[0][kay];
    //    console.log(`количество повтроений в базе = ${distinct}`);

if (distinct == 0) { // регистрируем нового пользователя только если нет в базе пары совпадающих логина и пароля
saveRegister(request.body);
//console.log('Регистрируем покупателя!')
//response.send(`${request.body.username} // ${request.body.phone} // ${request.body.email} // ${request.body.address} // ${request.body.login} // ${request.body.password}`);
response.send('0');
}

else {console.log('Не пойдет!Такой логин и пароль уже есть!');
response.send('1');
};

};

});

function saveRegister(data) { //записываем информацию о пользователе
// data - информация о пользователе


  let sql;
  // перечисляем столбцы базы данных для внесения информации от зарегистрированного пользователя

 sql = "INSERT IGNORE INTO user_info (user_name, user_phone, user_email, address, login, password) VALUES ('" + data.username + "', '" + data.phone + "', '" + data.email + "','" + data.address + "','" + data.login + "','" + data.password + "')";
 con.query(sql, function (error, result) { // выполняем запрос
    if (error) throw error; // если ошибка бросаем исключение
    });
};
});

//----------------------------
//Страница входа в личный кабинет для зарегистрированного пользователя

app.post('/signin', function(request, response){ // fetch-запрс от register.js принимаем на сервере
  // fetch из register.js str 19

if(!request.body) return response.sendStatus(400);
  
//  console.log(request.body); // request.body - то, что мы получли от register.js  


  let login0 = request.body.login0;
  let password0 = request.body.password0;
  global.login0 = login0;
  global.password0 = password0;
//  console.log(global.login0, global.password0);

   con.query(
   'SELECT COUNT(*) FROM user_info WHERE login ="' + request.body.login0 + '" AND password ="' + request.body.password0 + '" ',
  
      function (error, result) {
        if (error) reject(error);
   //     console.log(result[0]);
   //     for (let kay in result[0]) {console.log(kay)};
        for (let kay in result[0]) {
          let distinct = result[0][kay];
    //    console.log(`количество повтроений в базе = ${distinct}`);

if (distinct == 1) { // входим в личный кабинет только если в базе есть пара совпадающих логина и пароля
console.log('Входим в кабинет!');

          //определяеи имя пользователя по логину и паролю
          con.query(
                'SELECT user_name FROM user_info WHERE login ="' + request.body.login0 + '" AND password ="' + request.body.password0 + '" ', 
                function (error, result, fields) {
                if (error) throw error;  
                for (let kay in result[0]) {
                let name = result[0][kay];  
              //  console.log(name); // имя пользователя 
               // console.log(result[0]);
                global.name = name;
              //  console.log(global.name);// имя пользователя, global - передаем в блок cabinet
               // response.send(result[0][kay]); 
               response.send(global.name);
                }
                })
}
else {console.log('Не пойдет!Таких логина и пароля нет!');
response.send('0');
};

};

});
});


function saveRegister(data) { //записываем информацию о пользователе
// data - информация о пользователе


  let sql;
  // перечисляем столбцы базы данных для внесения информации от пользователя

 sql = "INSERT IGNORE INTO user_info (user_name, user_phone, user_email, address, login, password) VALUES ('" + data.username + "', '" + data.phone + "', '" + data.email + "','" + data.address + "','" + data.login + "','" + data.password + "')";
 con.query(sql, function (error, result) { // выполняем запрос
    if (error) throw error; // если ошибка бросаем исключение
    });
};


//отправляем пользователю страницу личного кабинета
app.get('/cabinet', function (request, response) {//register.js str.38

// выводим информацию о заказах пользователя
con.query('SELECT id, goods_id, goods_cost, goods_amount, total, from_unixtime(date,"%Y-%m-%d %h:%m") as human_date FROM shop_order WHERE login ="' + global.login0 + '" AND password ="' + global.password0 + '" ', 

function (error, result, fields) { //последние заказы выводятся первыми
      if (error) throw error;
    //  console.log(result);
      response.render('cabinet', {user: global.name, order: JSON.parse(JSON.stringify(result))})  
    }); //cabinet.pug str.13,  site_header_cabinet.pug str.40
   
});



//отправляем пользователю форму для оформления заказа, cart.pug str.18
app.get('/order', function (request, response) {
  response.render('order');
  });

//выводим окончание заказа постоянного клиента
app.post('/finish-order', function(request, response){ // fetch-запрс от order.js принимаем на сервере
  // fetch из order.js str 19
//  console.log(request.body.key); // request.body - то, что мы получли от order.js, информация о товарах из корзины, логин и пароль пользователя
  let key = Object.keys(request.body.key); //id товаров
//    console.log(key);
//    console.log(key.length);

  if (key.length == 0) { //если корзина пуста
//  console.log('Ваша корзина пуста!');
          response.send('2');
  }  
  else if (key.length != 0) { //если корзина не пуста
  
//  console.log('В корзине что-то есть!');

    con.query(
      'SELECT COUNT(*) FROM user_info WHERE login ="' + request.body.login + '" AND password ="' + request.body.password + '" ',
      function (error, result, fields) {
        if (error) reject(error);
   //    console.log(result[0]); // число совпадений логина и пароля (0 или 1)
   //    for (let kay in result[0]) {console.log(kay)};
        for (let kay in result[0]) {
          let distinct = result[0][kay];
    //      console.log(`количество повтроений в базе = ${distinct}`);
        if (distinct == 1) { // регистрируем заказ только если в базе есть пара совпадающих логина и пароля
//        console.log('Оформляем заказ!');
       
                con.query(
                'SELECT id, name, cost, category FROM goods WHERE id IN ('+key.join(',')+')', 
                function (error, result, fields) {
                if (error) throw error;  //если возникнет проблема отправки, то сработает перехватчик
            //  console.log(result[0]); // информация о товаре в корзине
                sendMail(request.body, result).catch(console.error); 
                saveOrder(request.body, result); // когда пользователь выбирает Оформить заказ, на сервер отправляется информация об имени, телефоне, email, это всё в request.body
            //    saveByAmount(request.body, result);// когда пользователь выбирает Оформить заказ, на сервер отправляется информация о выбранном товаре
            //  console.log(request.body.key);
                response.send('1'); //если ошибки отправки нет, в responce выводится 1, метод responce.send - отправка сырых данных
                });
  
          }

        else {
//          console.log('Не пойдет!Такого логина и пароля нет!');
          response.send('0');
        };

      };

    });
  };

});



function saveOrder(data, result) { // сохраняется в базе информация о заказе при правильном логине, пароле и непустой корзине
// data - информация о пользователе
// result - информация о товаре
  let sql;
  
  date = new Date() / 1000; // (в секундах)
  for (let i = 0; i < result.length; i++) {
    // информация о заказе постоянного покупателя заносится в таблицу shop_order
    sql = "INSERT INTO shop_order (date, goods_id, goods_cost, goods_amount, total, login, password) VALUES (" + date + ", " + result[i]['id'] + ", " + result[i]['cost'] + "," + data.key[result[i]['id']] + ", " + data.key[result[i]['id']] * result[i]['cost'] + ", '" + data.login + "','" + data.password + "')";
   // console.log(sql);
   // содержимое корзины находится в localStorage
    con.query(sql, function (error, result) {
      if (error) throw error;
//      console.log("1 record inserted");
    });

    //информация о заказе постоянного покупателя вносится в таблицу покупок
sql = "INSERT INTO purchases (goods_id, goods_cost, category, by_amount, by_sum) VALUES (" + result[i]['id'] + ", " + result[i]['cost'] + ", " + result[i]['category'] + ", " + data.key[result[i]['id']] + ", " + data.key[result[i]['id']] * result[i]['cost'] + ")";
//   console.log(sql);
   // содержимое корзины находится в localStorage
    con.query(sql, function (error, result) {
      if (error) throw error;
     
    });
  }
}



//выводим окончание заказа гостя
app.post('/finish-order-gest', function(request, response){ // fetch-запрс от order.js принимаем на сервере
  // fetch из order.js str 104
//  console.log(request.body); // request.body - то, что мы получли от order.js

//console.log(request.body.key); // request.body - то, что мы получли от order.js, информация о товарах из корзины, логин и пароль пользователя
  let key = Object.keys(request.body.key); //id товаров
//    console.log(key);
//    console.log(key.length);

  if (key.length == 0) { //если корзина пуста
//  console.log('Ваша корзина пуста!');
          response.send('2');
  }  
  else if (key.length != 0) { //если корзина не пуста
  
//  console.log('В корзине что-то есть!');
  
      con.query('SELECT id, name, cost, category, brend FROM goods WHERE id IN ('+key.join(',')+')', function (error, result, fields) {
      if (error) throw error;  //если возникнет проблема отправки, то сработает перехватчик
      for (let i = 0; i < result.length; i++) {
//       console.log(result[i]) 
      };
      sendMail(request.body, result).catch(console.error); 
      saveOrderGest(request.body, result); // когда пользователь выбирает Оформить заказ, на сервер отправляется информация об имени, телефоне, email, это всё в request.body
 //     saveByAmountGest(request.body, result); // когда пользователь выбирает Оформить заказ, на сервер отправляется информация о выбранных товарах 
      response.send('1'); //если ошибки отправки нет, в response выводится 1, метод response.send - отправка сырых данных
  });
    }
    else {
      response.send('0');
    }
   });

function saveOrderGest(data, result) { // сохраняется в базе информация о заказе при правильном логине, пароле и непустой корзине
// data - информация о пользователе
// result - информация о товаре
  let sql;
//информация о госте вносится в таблицу gest_info
sql = "INSERT INTO gest_info (gest_name, gest_phone, gest_email, gest_address) VALUES ('" + data.gestname + "', '" + data.gestphone + "', '" + data.gestemail + "','" + data.gestaddress + "')";
// console.log(sql);
 con.query(sql, function (error, result) { // выполняем запрос
    if (error) throw error; // если ошибка бросаем исключение
    });

  date = new Date() / 1000; // (в секундах)
  for (let i = 0; i < result.length; i++) {

    //информация о заказе гостя вносится в таблицу заказов гостей
sql = "INSERT INTO gest_order (date, goods_id, goods_cost, goods_amount, total, gest_name) VALUES (" + date + ", " + result[i]['id'] + ", " + result[i]['cost'] + "," + data.key[result[i]['id']] + ", " + data.key[result[i]['id']] * result[i]['cost'] + ", '" + data.gestname + "')";
//    console.log(sql);
   // содержимое корзины находится в localStorage
    con.query(sql, function (error, result) {
      if (error) throw error;
//      console.log("1 record inserted");
    });

    //информация о заказе гостя вносится в таблицу покупок
sql = "INSERT INTO purchases (goods_id, goods_cost, category, by_amount, by_sum) VALUES (" + result[i]['id'] + ", " + result[i]['cost'] + ", " + result[i]['category'] + ", " + data.key[result[i]['id']] + ", " + data.key[result[i]['id']] * result[i]['cost'] + ")";
//   console.log(sql);
   // содержимое корзины находится в localStorage
    con.query(sql, function (error, result) {
      if (error) throw error;
     
    });

  }
}


//--------------------------------------------------------------------------------------------------------------------

// поисковик
app.post('/search', function (request, responce) {  // search.js str.38
 // получаем все наименования товаров 
   con.query('SELECT id, name FROM goods', function (error, result, fields) { 
    if (error) throw error;

    //  console.log(result); //выводится массив в формате RowDataParket
      
      /*чтобы найти нужный name нужно перебрать весь объект и искать совпадение по name
      перепаковка массива, делаем индексацию удобной 
      массив переиндексируем, ключ массива совпадает с name товара, не нужно перебирать весь объект товара
      */

      let goodsObject = {}; // перепаковка объекта в удобную форму
        for (let i = 0; i < result.length; i++) {
        goodsObject[result[i]['name']] = i;
        }
   
      //console.log(result); //result - то, что получаем в результате выборки из mysql
     // console.log(goodsObject); // ключи объекта - названия товаров
      let goodsArray =  Object.keys(goodsObject); // создаем из ключей объекта - массив имен товаров (массив легче обрабатывать)
      responce.json(goodsArray);  //то, что ответил сервер - массив названий товаров, 
      //responce.json - метод, который преобразует наш ответ в json-строку, 
      // ответ передаем в файл search.js  в виде массива наименований товаров
      //console.log(goodsArray);
      });
});

// ответ на поиск

app.post('/searchAnswer', function (request, responce) { //search.js str.64
 // получаем точные наимнования товаров, удовлетворяющих условиям поиска
 //console.log(request.body.answer); // request.body.answer - массив, то, что мы получли от search.js стр. 47 (второй fetch) 
//console.log(request.body.answer.join(','));
if (request.body.answer.length !=0){
  // выбираем весь объект товаров с подходящим условиям поиска названием
  //con.query('SELECT * FROM goods WHERE name="' + request.body.answer + '"', function (error, result, fields) {
// делаем так, потому, что нужен один ответ в одгом запросе    
con.query('SELECT id, name, slug, image, cost FROM goods WHERE name="' + request.body.answer[0] + '" or name="' + request.body.answer[1]
  + '" or name="' + request.body.answer[2] + '" or name="' + request.body.answer[3] + '" or name="' + request.body.answer[4] 
  + '" or name="' + request.body.answer[5] + '" or name="' + request.body.answer[6] + '" or name="' + request.body.answer[7]
  + '" or name="' + request.body.answer[8] + '" or name="' + request.body.answer[9] + '" or name="' + request.body.answer[10]
  + '" or name="' + request.body.answer[11] + '" or name="' + request.body.answer[12] + '" or name="' + request.body.answer[13] 
  + '"', function (error, result, fields) {
if (error) throw error;
   
  responce.json(result);
//  console.log(result);  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//  console.log('^^^^^^^^^^^^^^^^^');  //^^^^^^^^^^^^^^^^^^^^^
  });
}
else{
  responce.send('0');
 }
});

//-----------------------------------------------------------------------------------------------------------------

async function sendMail(data, result){  //асинхронная функция принимает post-запрос от другой функции, result - выборка из баз данных с описанием товаров
let response = '<h2>Ваш заказ в интернет-магазине Вася Пупкин&Ко</h2>'; //формируем html-письмо
  let total = 0; //сколько денег всего
  for (let i = 0; i < result.length; i++) {//конкатенируем описание товара
    response += `<p>${result[i]['name']} - ${data.key[result[i]['id']]} - ${result[i]['cost'] * data.key[result[i]['id']]} руб.</p>`;
    total += result[i]['cost'] * data.key[result[i]['id']];
  }
   
  console.log(response);
  response += '<hr>';
  response += `Total ${total} руб.`;
  response += `<hr>Phone: ${data.phone}`;
  response += `<hr>Username: ${data.username}`;
  response += `<hr>Address: ${data.address}`;
  response += `<hr>Email: ${data.email}`;

  //тестовый сервер nodemailer
  let testAccount = await nodemailer.createTestAccount();// создаем тестовый аккаунт на сервере nodemailer

  let transporter = nodemailer.createTransport({ //настройка тестового аккаунта nodemailer
    host: "smtp.ethereal.email", //адрес почтового сервера, который отправляет email
    port: 587, //порт почтового сервера, по умолчанию может быть 25, 465 или 587;
    secure: false, // булевое значение, true for 465, false for other ports
    auth: { //объект со свойствами user и pass, в которых указывается логин и пароль используемого почтового аккаунта соответственно
      user: testAccount.user, // generated ethereal user //сгенерированные данные пользователя 
      pass: testAccount.pass // generated ethereal password // сгенерированный пароль
    }
  });

  let mailOption = {  //опции письма
    from: '"Node js" <nodejs@example.com>',
    to: "email заказчика" + data.email,
    subject: "Заказ из интернет-магазина Вася Пупкин&Ко",
    text: 'Упрощенный вариант заказа',
    html: response
  };



//отправка сообщения
  let info = await transporter.sendMail(mailOption);
  console.log("MessageSent: %s", info.messageId); //id сообщения
  console.log("PreviewSent: %s", nodemailer.getTestMessageUrl(info)); //где можно посмотреть сообщения
  return true;
};


//-----------------------------------------------------------------------------------------------------------------



 function makeHash(length) {
 let result = '';
 let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
 result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
   return result;
 }

//-----------------------------------------------------------------------------------------------------------------



//админ-панель, loginAdmin.pug 
app.get('/admin', function (request, response) { //вывод страницы админа
  response.render('admin', {});
});

//admin.pug str.6 
app.get('/admin-order', function (request, response) { 
  con.query(`SELECT 
    shop_order.id as id,
    from_unixtime(date,"%Y-%m-%d %h:%m") as human_date,
    shop_order.goods_id as goods_id,
    shop_order.goods_cost as goods_cost,
    shop_order.goods_amount as goods_amount,
    shop_order.total as total,
    shop_order.login as login,
    shop_order.password as password,    
    user_info.user_name as name,
    user_info.user_phone as phone,
    user_info.address as address,
    user_info.user_email as email
FROM 
  shop_order
LEFT JOIN 
  user_info
ON shop_order.login = user_info.login AND shop_order.password = user_info.password
`, 
function (error, result, fields) { //последние заказывыводятся первыми
      if (error) throw error;
  //    console.log(result);
      response.render('admin-order', { order: JSON.parse(JSON.stringify(result)) });
    });
});

//admin.pug str.10
app.get('/admin-goods1', function (request, response) { 
    con.query(`SELECT
    shop_order.id as id,
    from_unixtime(date,"%Y-%m-%d %h:%m") as human_date,
    shop_order.goods_id as goods_id,
    goods.name,
    shop_order.goods_cost as goods_cost,
    shop_order.goods_amount as goods_amount,
    shop_order.goods_cost*shop_order.goods_amount as goods_sum
FROM 
  shop_order
INNER JOIN 
  market.goods
ON shop_order.goods_id = goods.id ORDER BY id DESC 
`,
function (error, result, fields) { 
    response.render('admin-goods1', { goods: JSON.parse(JSON.stringify(result)) });
    });
});

//admin.pug str.13
app.get('/admin-goods2', function (request, response) { 
    con.query(`SELECT 
    goods_id, 
    goods.name,
    shop_order.goods_cost as goods_cost,
    SUM(shop_order.goods_amount) as goods_amount,
    goods_cost * SUM(goods_amount) as goods_sum  
FROM 
  market.shop_order 
INNER JOIN 
  market.goods
ON shop_order.goods_id = goods.id GROUP BY goods.id`, 
function (error, result, fields) { 
   // console.log(result);
    response.render('admin-goods2', { goods: JSON.parse(JSON.stringify(result)) });
    });
});

//admin.pug str.17
app.get('/admin-goods3', function (request, response) { 
    con.query(`SELECT 
    SUM(shop_order.goods_amount) as goods_amount,
    SUM(goods_cost * goods_amount) as goods_sum,
    market.shop_order.login  as login,
    market.user_info.user_name  as user_name
FROM 
  market.shop_order 
INNER JOIN 
  market.user_info
ON shop_order.login = user_info.login
GROUP BY market.user_info.id
`, 
function (error, result, fields) { 
//    console.log(result);
    response.render('admin-goods3', { goods: JSON.parse(JSON.stringify(result)) });
    });
});


//admin.pug str.21
app.get('/admin-goods4', function (request, response) { 
    con.query(`SELECT 
    shop_order.id as id,
    from_unixtime(date,"%Y-%m-%d %h:%m") as human_date,  
    goods_id, 
    goods.name,
    shop_order.goods_cost as goods_cost,
    shop_order.goods_amount as goods_amount,
    goods_cost * goods_amount as goods_sum,
    market.shop_order.login  as login,
    market.user_info.user_name  as user_name
FROM 
  market.shop_order 

INNER JOIN 
  market.goods
ON shop_order.goods_id = goods.id

INNER JOIN 
  market.user_info
ON shop_order.login = user_info.login
WHERE market.user_info.id = 788
`, 
function (error, result, fields) { 
//    console.log(result);
    response.render('admin-goods4', { goods: JSON.parse(JSON.stringify(result)) });
    });
});


//admin.pug str.24
app.get('/admin-customer', function (request, response) { 
  con.query(`SELECT DISTINCT
    user_info.user_name as user_name, 
    user_info.user_phone as user_phone, 
    user_info.address as address, 
    user_info.user_email as user_email,
    user_info.login as login,
    user_info.password as password    
  FROM market.user_info`, 
    function (error, result, fields) {
      if (error) throw error;
  //    console.log(result);
response.render('admin-customer', { customer: JSON.parse(JSON.stringify(result)) });      
    });
});


//admin.pug str.28
app.get('/admin-gest', function (request, response) { 
  con.query(`SELECT DISTINCT
    gest_info.gest_name as gest_name, 
    gest_info.gest_phone as gest_phone, 
    gest_info.gest_address as gest_address, 
    gest_info.gest_email as gest_email
  FROM market.gest_info`, 
    function (error, result, fields) {
      if (error) throw error;
//      console.log(result);
response.render('admin-gest', { gest: JSON.parse(JSON.stringify(result)) });      
    });
});

//admin.pug str.31
app.get('/admin-order-gest', function (request, response) { 
  con.query(`SELECT DISTINCT
    gest_order.id as id,
    gest_order.goods_id as goods_id,
    gest_order.goods_cost as goods_cost,
    gest_order.goods_amount as goods_amount,
    gest_order.total as total,
    from_unixtime(date,"%Y-%m-%d %h:%m") as human_date,
    gest_info.gest_name as name,
    gest_info.gest_phone as phone,
    gest_info.gest_address as address,
    gest_info.gest_email as email
FROM 
  gest_order
LEFT JOIN 
  gest_info
ON gest_order.gest_name = gest_info.gest_name ORDER BY id DESC`, function (error, result, fields) { //последние заказывыводятся первыми
      if (error) throw error;
    //  console.log(result);
      response.render('admin-order-gest', { ordergest: JSON.parse(JSON.stringify(result)) });
    });
});

//admin.pug str.35
app.get('/admin-store', function (request, response) { 


con.query(`
SELECT 
  store.goods_id as id,
  store.amount as amount,
  SUM(IFNULL(purchases.by_amount, 0)) as by_amount, 
  amount - SUM(IFNULL(purchases.by_amount, 0)) AS remainder
FROM 
  purchases
RIGHT JOIN 
  store
ON store.goods_id = purchases.goods_id 


GROUP BY id

`, 
function (error, result, fields) { //последние заказы выводятся первыми
      if (error) throw error;
      console.log(result);




      response.render('admin-store', { store: JSON.parse(JSON.stringify(result)) });
    });


});



//логин администратора, footer.pug str.5, footerMain.pug str.5
app.get('/loginAdmin', function (request, response) { //посылаем форму для ввода логина и пароля
  response.render('loginAdmin', {});
});

app.post('/loginAdmin', function (request, response) { //обработчик запроса
  // fetch из loginAdmin.js str 3
//  console.log('=======================');
  // вытягиваем данные из формы в несколько ходов
//  console.log(request.body);
//  console.log(request.body.loginAdmin);
//  console.log(request.body.passwordAdmin);
//  console.log('=======================');
  con.query('SELECT * FROM user WHERE loginAdmin="' + request.body.loginAdmin + '" and passwordAdmin="' + request.body.passwordAdmin + '"',
    function (error, result) {
      if (error) reject(error);
//     console.log(result);
//      console.log(result.length);
      if (result.length == 0) {
//        console.log('error, user not found!!!');
        response.redirect('/loginAdmin');
        }
    else {
      result = JSON.parse(JSON.stringify(result));
         // двойное преобразование, работаем с выборкой как с массивом, операция не является критичной если база данных пустая
      //------------responce.cookie('hash', 'blablabla');
      let hash = makeHash(32);
      response.cookie('hash', hash);
      response.cookie('id', result[0]['id']);//id пользователя, вычитанного из базы
            /**
         * write hash to db
         */
        sql = "UPDATE user  SET hash='" + hash + "' WHERE id=" + result[0]['id'];
        con.query(sql, function (error, resultQuery) {
          if (error) throw error;
          response.redirect('/admin');
        });
    }

//console.log(result);

           });
    });



//contacts.pug 
app.get('/contacts', function (request, response) { 
  response.render('contacts', {});
});


//форма обратной связи -------------------------------------------


app.post('/contacts', function(request, response){ // fetch-запрс от massage.js принимаем на сервере
  // fetch из message.js str 48
  console.log(request.body); // request.body - то, что мы получли от massage.js

  if (request.body.code1 == 'lijkghgfsxhcyjyujnojyggwdxgnhmhjblkjgx') {
  saveMessage(request.body);
  response.send('1');
}
 }); 
   


function saveMessage(data) { // сохраняется в базе информация о полученном сообщении
let sql;

date = new Date() / 1000; // (в секундах)
  
 
//информация о сообщении вносится в таблицу messages
sql = "INSERT INTO messages (date, gest_name, gest_phone, gest_email, gest_message) VALUES (" + date + ", '" + data.gestname1 + "', '" + data.gestphone1 + "', '" + data.gestemail1 + "','" + data.gestmessage1 + "')";
//console.log(sql);
 con.query(sql, function (error) { // выполняем запрос
    if (error) throw error; // если ошибка бросаем исключение
    });
};


//admin.pug str.39
app.get('/admin-messages', function (request, response) { 
  con.query(`SELECT 
    id, 
    from_unixtime(date,"%Y-%m-%d %h:%m") as human_date, 
    gest_name, 
    gest_phone, 
    gest_email, 
    gest_message 
    FROM market.messages`, 
    function (error, result, fields) {
      if (error) throw error;
  //    console.log(result);
response.render('admin-messages', { messages: JSON.parse(JSON.stringify(result)) });      
    });
});
