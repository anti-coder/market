//console.log('nav.js');

document.querySelector('.show-nav').onclick = showCloseNav; // кнопка открыть-закрыть меню навигации
//site_header.pug str.11,26

function showCloseNav() {
  let x = document.querySelector('.site-nav');  //показать\скрыть меню навигации, 
  //nav.pug str.3
  if (x.style.left === '-100%') {
    x.style.left = '0';
  } else {
    x.style.left = '-100%';
  }
}

function myFunction(y) {   //переключение иконки (nav.js, search.js)
    y.classList.toggle("fa-window-close");
};


function getCategoryList() { //получение списка категорий товаров
    //обертка для AJAX-запроса
    fetch('/get-category-list', //app.js str.285
        {
            method: 'POST'      // метод
        }
    ).then(function (response) {  //метод промиса, когда получим ответ, 
        //запустим функцию, в которую запустим ответ сервера
    //    console.log(response); // response - всё, что ответит сервер
        return response.text();
        }
    ).then(function (body) {      //метод промиса
        showCategoryList(JSON.parse(body));
      //   console.log(body); // список категорий
    }
    )
}

function showCategoryList(data) {        // выводим список категорий на страницу
   // console.log(data);
   //вывод над слайдером списка категорий
    let out = '<ul class="main-category-list"><li><a href="/">Главная страница</a></li>'; // главная страница
    for (let i = 0; i < data.length; i++) {
        out += `<li><a href="/cat?id=${data[i]['id']}">${data[i]['category']}</a></li>`;  // все категории по очереди
    }
    out += '</ul>';
    document.querySelector('#main-category-list').innerHTML = out;   //вывод над слайдером

    //вывод в меню навигации списка категорий
    let out1 = '<ul class="nav-category-list"><li><a href="/">Главная страница</a></li>'; // главная страница
   
    for (let i = 0; i < data.length; i++) {
        out1 += `<li><a href="/cat?id=${data[i]['id']}">${data[i]['category']}</a></li>`
        
    }
    out1 += '</ul>';
    
    document.querySelector('#nav-category-list').innerHTML = out1;   //вывод в меню навигации
    
}

showCloseNav();
getCategoryList();


//Меню сортировки

document.querySelector('.show-sort').onclick = showCloseSort; // кнопка открыть-закрыть меню сортировки
//cat.pug str.23
function showCloseSort() {
  let x = document.querySelector('.site-sort');  //показать\скрыть меню сортировки, 
  let row = document.querySelector('.row');
  //sort.pug str.3
  if (x.style.top === '-600px') {
    x.style.top = '187px';
    row.style.width = '68%';
    } 
    else {
    x.style.top = '-600px';
    row.style.width = '90%';
    }
  };


showCloseSort();


function getBrendList() { //получение списка брендов
    //обертка для AJAX-запроса
    fetch('/get-brend-list', //app.js str.297
        {
            method: 'POST'      // метод
        }        
    ).then(function (response) {  //метод промиса, когда получим ответ, 
        //запустим функцию, в которую запустим ответ сервера
    //    console.log(response); // response - всё, что ответит сервер
        return response.text();
        }
    ).then(function (body) {      //метод промиса
       showBrendList(JSON.parse(body)); //получили от сервера body-массив из объектов всех брендов
     //   console.log(body); // список брендов
     })

};

getBrendList();


function showBrendList(data) { //вывод в меню навигации списка брендов
    let out2 = '<ul class="sort-category-list">'; 
    for (let i = 0; i < data.length; i++) {
    out2 += `<li><input id="brend" name="dzen" type="radio" value="${data[i]['brend']}">${data[i]['brend']}</li>` ;
    };  
    out2 += '</ul>';
    document.querySelector('#sort-category-list').innerHTML += out2;   //вывод в меню навигации
    };


function displayRadioValue() { //sort.pug str.33, определякм категорию и бренд, выбранные пользователем 
    let elem = document.getElementsByName('dzen');//определяем какой бренд выбран пользователем
    for(i = 0; i < elem.length; i++) {
    if(elem[i].checked == true){
    document.getElementById("brend").innerHTML =+ elem[i].value;
    let myBrend = elem[i].value;
    console.log(myBrend);
    
    let cat = document.getElementById('cat').innerHTML;//определяем какая категория выбрана пользователем
  //  console.log(cat);

   fetch('/brend', {   //запрос на сервер, app.js str.227
          //передаем название бренда, выбранного пользователем
          method: 'POST',
          body: JSON.stringify({brend: myBrend,
                               category: cat}),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
          })
        .then(function (response) {  //когда получим ответ, 
        //запустится функция, в которой лежит необработанный ответ сервера в текстовом формате
        //    console.log(response); // response - всё, что ответит сервер
        return response.text();
        })
        .then(function(body){  //обработанные данные
         showBrend(body); // выводим выбранные товары на экран
      //   console.log(body);
         });
            };
        }
    };


displayRadioValue();


// верстка результата поиска


function showBrend(body){

document.querySelector('#choseBrend').innerHTML = ``; // очищаем предыдущую верстку

let a = JSON.parse(body);

console.log(a); // a - объект, соответствует бренду, информация с сервера

if (a.length !==0) { //если массив найденных брендов в заданной категории не пуст

for (let i = 0; i < a.length; i++){

let div = document.createElement('div'); 
div = `
<div class='card1'>
  <a href="/goods/${a[i]['slug']}">
    <div class='title'>
      <h4>${a[i]['name']}</h4>
    </div>

    <img src='/images/${a[i]['image']}'class="card-images" alt="${a[i]['slug']}"></img>
    <h4 class='text-center'>${a[i]['cost']} руб.</h4>
    </a>
    <ul class='card-actions'>
      <button data-goods_id="${a[i]['id']}" class='button button-primary add-to-cart'>id=${a[i]['id']} в корзину</button>
    </ul>
    
</div>
`

choseBrend.insertAdjacentHTML('afterbegin', div);

//console.log(a[i]['id']);

let elem = document.querySelector('[data-goods_id]'); // получаем элемент по data-атрибуту
console.log(elem);
let elem1 = elem.getAttribute('data-goods_id');  // читаем значение по data-атрибуту, id товара
console.log(elem1);


document.querySelectorAll('[data-goods_id]').forEach(function(element){ // на кнопки с data-атрибутом вешаем события, forEach - перебираем массив
  element.addEventListener("click", addToCart); //при клике на элемент выполняется функция добавления
});

document.querySelectorAll('[data-goods_id]').forEach(function(element){ // на кнопки с data-атрибутом вешаем события, forEach - перебираем массив
  element.addEventListener("click", alertCart); //при клике на элемент выдается сообщение о добавлении
});

  }

}

else { // если в категории нет товаров данного бренда 
 
let div2 = document.createElement('div2'); 
div2 = `
<div class='card2'> 
</div>
`
choseBrend.insertAdjacentHTML('afterbegin', div2);
//alert('В данной категории не найдено товаров данного бренда');
Swal.fire('В данной категории не найдено товаров данного бренда') //https://sweetalert2.github.io/#examples
};

};

document.querySelectorAll('#cleanBtn1').forEach(function(element){ // на id #foundBtn1 вешаем события, forEach - перебираем массив
  element.addEventListener("click", clear1); //при клике на элемент выполняется функция clear1()
  });


document.querySelectorAll('#allCat').forEach(function(element){ // на id #foundBtn1 вешаем события, forEach - перебираем массив
  element.addEventListener("click", allCat); //при клике на элемент выполняется функция allCat
  });


function clear1(){
  event.preventDefault();//останавливаем перезагрузку страницы 
  document.querySelector('#choseBrend').innerHTML = ``; // очищаем предыдущую верстку
};


function allCat(){
  let b = document.getElementById('cat').innerHTML;//определяем какая категория выбрана пользователем
  let url = '/cat?id=' + b;
 // alert(url);
  document.location.href = url; // выводим полностью категорию - сбрасываем фильтр 
};
  



