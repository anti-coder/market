let express = require('express'); //подключаем модуль express
let app = express(); //создали новый экземпляр класса express
let cookieParser = require('cookie-parser');// подключаем модуль для настройки файлов куки
let admin = require('./admin.js');// обратились к admin.js
let mysql = require('mysql'); //Подключаем mysql модуль (база данных)
let nodemailer = require('nodemailer'); //подключили модуль nodemailer

app.use(express.static('public')); //подключение статических файлов из папки public

app.set('view engine', 'pug');  //задаем шаблонизатор pug, подключили шаблоны pug в папке view

let con = mysql.createConnection({ //настраиваем mysql модуль (база данных)
  host: 'localhost',
  user: 'jul',
  password: '1313',
  database: 'market'
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //отключение проверки авторизации при работе локально

app.listen(3000, function () {   //слушаем порт 3000
//  console.log('node express work on 3000');
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


app.get('/', function (request, responce) {
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


app.get('/cat', function (request, responce) { //sort.pug str.17
   //get-запрос (через адресную строку) к базе данных, таблице категорий cat
  let catId = request.query.id;
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
app.get('/catDesc', function (request, responce) { //sort.pug str.19
   
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
app.get('/catBrendSort', function (request, responce) { //sort.pug str.25
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
app.post('/brend', function (request, responce) { //nav.js str.127

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
        responce.json(result);
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
app.post('/get-category-list', function (request, responce) { //nav.js str.23
//   console.log(request.body); //тело запроса, то, что получает нода в качестве входных параметров
    con.query('SELECT id, category FROM category', function (error, result, fields) {  //из таблицы категорий берем id и название категории
    if (error) throw error;
//    console.log(result);  
    responce.json(result); //responce.json - метод, который преобразует наш ответ в json-строку, 
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


//получаем корзину товаров
app.post('/get-goods-info', function (request, responce) {  //-----------cart.js str 67
 // fetch из cart.js str 67
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

//выводим корзину товаров на страницу
app.get('/cart', function (request, responce) {
  responce.render('cart'); //-------------------------- cart.js str 53
});

//выводим карточку заказа
app.get('/order', function (request, responce) {//get-запрос к базе данных, таблице товаров 
  responce.render('order');
  });



//выводим окончание заказа
app.post('/finish-order', function(request, responce){ // fetch-запрс от order.js принимаем на сервере
  // fetch из order.js str 31
//  console.log(request.body); // request.body - то, что мы получли от order.js
  if (request.body.key.length !=0){
      let key = Object.keys(request.body.key); //id товаров
      con.query('SELECT id, name, cost FROM goods WHERE id IN ('+key.join(',')+')', function (error, result, fields) {
      if (error) throw error;  //если возникнет проблема отправки, то сработает перехватчик
//      console.log(result);
      sendMail(request.body, result).catch(console.error); 
      saveOrder(request.body, result); // когда пользователь выбирает Оформить заказ, на сервер отправляется информация об имени, телефоне, email, это всё в request.body
      responce.send('1'); //если ошибки отправки нет, в responce выводится 1, метод responce.send - отправка сырых данных
  });
    }
    else {
      responce.send('0');
    }
   });


function saveOrder(data, result) {
// data - информация о пользователе
// result - информация о товаре
  let sql;
  // перечисляем столбцы базы данных
 sql = "INSERT IGNORE INTO user_info (user_name, user_phone, user_email, address) VALUES ('" + data.username + "', '" + data.phone + "', '" + data.email + "','" + data.address + "')";
 con.query(sql, function (error, result) { // выполняем запрос
    if (error) throw error; // если ошибка бросаем исключение
    });

  date = new Date() / 1000; // (в секундах)
  for (let i = 0; i < result.length; i++) {
    // перечисляем столбцы базы данных
    sql = "INSERT INTO shop_order (date, goods_id, goods_cost, goods_amount, total, user_name) VALUES (" + date + ", " + result[i]['id'] + ", " + result[i]['cost'] + "," + data.key[result[i]['id']] + ", " + data.key[result[i]['id']] * result[i]['cost'] + ", '" + data.username + "')";
//    console.log(sql);
    con.query(sql, function (error, result) {
      if (error) throw error;
//      console.log("1 record inserted");
    });
  }
}





//--------------------------------------------------------------------------------------------------------------------

// поисковик
app.post('/search', function (request, responce) {  // search.js str.21
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

app.post('/searchAnswer', function (request, responce) { //search.js str.47
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
let res = '<h2>Order in lite shop</h2>'; //формируем html-письмо
  let total = 0; //сколько денег всего
  for (let i = 0; i < result.length; i++) {//конкатенируем описание товара
    res += `<p>${result[i]['name']} - ${data.key[result[i]['id']]} - ${result[i]['cost'] * data.key[result[i]['id']]} uah</p>`;
    total += result[i]['cost'] * data.key[result[i]['id']];
  }
   
 // console.log(res);
  res += '<hr>';
  res += `Total ${total} uah`;
  res += `<hr>Phone: ${data.phone}`;
  res += `<hr>Username: ${data.username}`;
  res += `<hr>Address: ${data.address}`;
  res += `<hr>Email: ${data.email}`;

  //тестовый сервер nodemailer
  let testAccount = await nodemailer.createTestAccount();// создаем тестовый аккаунт на сервере nodemailer

  let transporter = nodemailer.createTransport({ //настройка тестового аккаунта nodemailer
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user //сгенерированные данные пользователя 
      pass: testAccount.pass // generated ethereal password // сгенерированный пароль
    }
  });

  let mailOption = {  //опции письма
    from: '<jul.andrrr@gmail.com>',
    to: "jul.andrrr@gmail.com," + data.email,
    subject: "Lite shop order",
    text: 'Упрощенный вариант заказа',
    html: res
  };

//отправка сообщения
  let info = await transporter.sendMail(mailOption);
//  console.log("MessageSent: %s", info.messageId); //id сообщения
//  console.log("PreviewSent: %s", nodemailer.getTestMessageUrl(info)); //где можно посмотреть сообщения
  return true;
};


 function makeHash(length) {
 let result = '';
 let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
 result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
   return result;
 }


//админ-панель
app.get('/admin', function (request, responce) { //вывод страницы админа
  responce.render('admin', {});
});


app.get('/admin-order', function (request, responce) { 
  con.query(`SELECT DISTINCT
    shop_order.id as id,
    shop_order.goods_id as goods_id,
    shop_order.goods_cost as goods_cost,
    shop_order.goods_amount as goods_amount,
    shop_order.total as total,
    from_unixtime(date,"%Y-%m-%d %h:%m") as human_date,
    user_info.user_name as user,
    user_info.user_phone as phone,
    user_info.address as address,
    user_info.user_email as email
FROM 
  shop_order
LEFT JOIN 
  user_info
ON shop_order.user_name = user_info.user_name ORDER BY id DESC`, function (error, result, fields) { //последние заказывыводятся первыми
      if (error) throw error;
    //  console.log(result);
      responce.render('admin-order', { order: JSON.parse(JSON.stringify(result)) });
    });
});


app.get('/admin-goods1', function (request, responce) { 
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
ON shop_order.goods_id = goods.id ORDER BY id DESC`, function (error, result, fields) { 
  
    responce.render('admin-goods1', { goods: JSON.parse(JSON.stringify(result)) });
    });
});

app.get('/admin-goods2', function (request, responce) { 
    con.query(`SELECT 
    goods_id, 
    goods.name,
    shop_order.goods_cost as goods_cost,
    SUM(goods_amount) as goods_amount,
    shop_order.goods_cost*SUM(goods_amount) as goods_sum  
FROM 
  market.shop_order 
INNER JOIN 
  market.goods
ON shop_order.goods_id = goods.id GROUP BY goods.id`, function (error, result, fields) { 
    responce.render('admin-goods2', { goods: JSON.parse(JSON.stringify(result)) });
    });
});




app.get('/admin-customer', function (request, responce) { 
  con.query(`SELECT DISTINCT
    user_info.user_name as user_name, 
    user_info.user_phone as user_phone, 
    user_info.address as address, 
    user_info.user_email as user_email
  FROM market.user_info`, 
    function (error, result, fields) {
      if (error) throw error;
  //    console.log(result);
responce.render('admin-customer', { customer: JSON.parse(JSON.stringify(result)) });      
    });
});

//логин
app.get('/login', function (request, responce) { //обработчик запроса
  responce.render('login', {});
});

app.post('/login', function (request, responce) { //обработчик запроса
  // fetch из login.js str 3
//  console.log('=======================');
  // вытягиваем данные из формы в несколько ходов
//  console.log(request.body);
//  console.log(request.body.login);
//  console.log(request.body.password);
//  console.log('=======================');
  con.query('SELECT * FROM user WHERE login="' + request.body.login + '" and password="' + request.body.password + '"',
    function (error, result) {
      if (error) reject(error);
//     console.log(result);
//      console.log(result.length);
      if (result.length == 0) {
//        console.log('error, user not found!!!');
        responce.redirect('/login');
        }
    else {
      result = JSON.parse(JSON.stringify(result));
         // двойное преобразование, работаем с выборкой как с массивом, операция не является критичной если база данных пустая
      //------------responce.cookie('hash', 'blablabla');
      let hash = makeHash(32);
      responce.cookie('hash', hash);
      responce.cookie('id', result[0]['id']);//id пользователя, вычитанного из базы
            /**
         * write hash to db
         */
        sql = "UPDATE user  SET hash='" + hash + "' WHERE id=" + result[0]['id'];
        con.query(sql, function (error, resultQuery) {
          if (error) throw error;
          responce.redirect('/admin');
        });
    }

//console.log(result);

           });
    });
