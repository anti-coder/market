//поисковик по сайту

//console.log('search.js');
 
let goodsArray = {}; //массив имен товаров, которые соответствуют поиску пользователя

document.querySelectorAll('#foundBtn').forEach(function(element){ // на id #foundBtn вешаем события click, forEach - перебираем массив
  element.addEventListener("click", search); //при клике на элемент выполняется функция search()
  });

// document.querySelector('#foundField').addEventListener('keydown', function(e) {
// if (e.keyCode === 13) {
// console.log(this.value);
// search();
// }
//  });

document.querySelectorAll('#foundField').forEach(function(element){ // на id #foundField вешаем события нажатия enter (клавиша 13), forEach - перебираем массив
  element.addEventListener("keydown", function(e) {
 if (e.keyCode === 13) {
// console.log(this.value);
 search();
};
});
});


document.querySelectorAll('#cleanBtn').forEach(function(element){ // на id #foundBtn вешаем события, forEach - перебираем массив
  element.addEventListener("click", clear); //при клике на элемент выполняется функция clean()
  });


function search(){ 
event.preventDefault();//останавливаем перезагрузку страницы
let found = document.querySelector('#foundField').value.trim().toLowerCase().replace(" ", ""); //trim обрезает пробелы справа и слева  

if (found.length >2){
  fetch('/search', {   //запрос на сервер всех наименований товаров app.js str.602
      method: 'POST',
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
   
    .then(function (body) {      //обработка текстового ответа сервера
    //    console.log(found);
        let goodsArray = (JSON.parse(body)); // получили от сервера goodsArray - массив всех наименований товаров

      //  console.log(goodsArray); // массив всех товаров
      // проверим, включают ли названия товаров элементы, введенные пользователем в поле search 
      //  foundArray - массив наименований товаров, соответствующих поиску пользователя
        
        let foundArray = goodsArray.filter(item => item.toLowerCase().replace(" ", "").includes(found));
        
     //   console.log(foundArray);

        fetch('/searchAnswer', {   //отправляем повторно запрос на сервер, app.js str.631
          //передаем точные наимнования товаров, удовлетворяющих условиям поиска
          method: 'POST',
          body: JSON.stringify({answer: Object.values(foundArray)}),
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
         showAnswer(body); // выводим выбранные товары на экран
         });
    });
};

document.querySelector('#foundField').value = ``; // очищаем поле поиска     
};

// верстка результата поиска
function showAnswer(body){

document.querySelector('#answer').innerHTML = ``; // очищаем предыдущую верстку

let a = JSON.parse(body);

console.log(a); // a - объект

for (let i = 0; i < a.length; i++){

let div = document.createElement('div'); // создаем карточки найденных в поиске товавра

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
    <button data-goods_id="${a[i]['id']}" class='button button-primary add-to-cart' onclick='addToCart1()'>id=${a[i]['id']} в корзину</button>
    </ul>
</div>
`

answer.insertAdjacentHTML('afterbegin', div); // вставляем div в поле answer

document.querySelector('.row').style.opacity = `0.4`; // затуманиваем поле вне поиска

console.log(a[i]['id']);

let elem = document.querySelector('[data-goods_id]');
let elem1 = elem.getAttribute('data-goods_id');
console.log(elem1);

document.querySelectorAll('[data-goods_id]').forEach(function(element){ // на кнопки с data-атрибутом вешаем события, forEach - перебираем массив
  element.addEventListener("click", addToCart); //при клике на элемент выполняется функция добавления
});

document.querySelectorAll('[data-goods_id]').forEach(function(element){ // на кнопки с data-атрибутом вешаем события, forEach - перебираем массив
  element.addEventListener("click", alertCart); //при клике на элемент выполняется функция добавления
});

  }
};


function clear(){
event.preventDefault();//останавливаем перезагрузку страницы 
document.querySelector('#foundField').value = ``; // очищаем поле поиска  
document.querySelector('#answer').innerHTML = ``; // очищаем предыдущую верстку
document.querySelector('.row').style.opacity = `1`; //возвращаем нормальную прозрачность поля вне поиска
}


