let cart = {}; //корзина всегда представлена в виде массива

document.querySelectorAll('.add-to-cart').forEach(function(element){ // на кнопки класса .add-to-cart вешаем события, forEach - перебираем массив
  element.addEventListener("click", addToCart); //при клике на элемент выполняется функция добавления
});

document.querySelectorAll('.add-to-cart-goods').forEach(function(element){ // на кнопки класса .add-to-cart вешаем события, forEach - перебираем массив
  element.addEventListener("click", addToCart); //при клике на элемент выполняется функция добавления
});

document.querySelectorAll('.add-to-cart').forEach(function(element){ // на кнопки класса .add-to-cart вешаем события, forEach - перебираем массив
  element.addEventListener("click", alertCart); //при клике на элемент выполняется функция оповещения
});

document.querySelectorAll('.add-to-cart-goods').forEach(function(element){ // на кнопки класса .add-to-cart вешаем события, forEach - перебираем массив
  element.addEventListener("click", alertCart); //при клике на элемент выполняется функция оповещения
});

document.querySelectorAll('.clean-cart').forEach(function(element){ // на кнопки класса .clean-cart вешаем события, forEach - перебираем массив
  element.addEventListener("click", cleanCart); //при клике на элемент выполняется функция оповещения
});


if (localStorage.getItem('cart')){ //если корзина уже существует
  cart = JSON.parse(localStorage.getItem('cart')); // вывести информацию о корзине
  ajaxGetGoodsInfo(); //отрисовать корзину
}

function addToCart(){
  let goodsId = this.dataset.goods_id; //получает id элемента, this.dataset-обращение ко всем элементам data
  if (cart[goodsId]) { // если cart[goodsId] существует, то увеличение на 1 (количество товара) 
    cart[goodsId]++;
  }
  else {
    cart[goodsId] = 1;
  }
  console.log(cart);
  ajaxGetGoodsInfo();
}


function alertCart(){
 const swalWithBootstrapButtons = Swal.mixin({ // см. https://sweetalert2.github.io/
  customClass: {
    confirmButton: 'btn-continue',
    cancelButton: 'btn-cart'
  },
  buttonsStyling: false
})

swalWithBootstrapButtons.fire({
  title: 'Товар добавлен в корзину',
  showCancelButton: true,
  confirmButtonText: 'Перейти в корзину',
  cancelButtonText: 'Продолжить покупки',
  reverseButtons: true
}).then((result) => {
  if (result.isConfirmed) {
    window.location = "/cart";
  } else if (
      result.dismiss === Swal.DismissReason.cancel
  ) {
    window.location = "/cat";
  }
})
}



function ajaxGetGoodsInfo(){ //визуализируем корзину товаров, получаем всю информацию о товаре, посылаем post-запрос на сервер, вытаскиваем товар по id из корзины
  updateLocalStorageCart(); //сохранение товаров в корзине
  //fetch-запрос, узнаем, что сделал пользователь на сайте 
  fetch('/get-goods-info',{ //app.js str.311
    method: 'POST',
    body: JSON.stringify({key: Object.keys(cart)}), //параметр, посылаемый на сервер, ключи товара, объект запаковываем в строу JSON
    headers: {                            // чтобы правильно послать сторку JSON (в каком формате буду работать) 
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
    }
  })
  .then(function(response){ //возвращается объект ответа: сырые данные с текстовой информацией
    return response.text(); //чтбы после положительного ответа был возвращен  body
  })
  .then(function(body){  //обработанные данные
  //  console.log(body); // описание корзины
    showCart(JSON.parse(body)); // выводим корзину на экран
  })
}

function showCart(data) { // вывод товара на экран, data - описание в виде объекта от сервера
  //let out = '<table class="table table-striped table-cart"><tbody>';//выводим данные в виде таблицы
  let out = '<table class="table"><tbody>';//выводим данные в виде таблицы
  let total = 0; // сумма товаров в корзине
  let amount = 0;
  for (let key in cart){ // ассоциативный перебор по объекту, перебираем общий массив cart
    
    //out +=`<tr><td><img 
    //            src='/images/${data[key]['image']}' alt="${data[key]['slug']}"></td></tr>`;
    
    //out +=`<tr><td colspan="4"><a href="/goods/${data[key]['slug']}">${data[key]['name']}</a></tr>`; 

    out +=`<tr><td colspan="4"><a href="/goods/${data[key]['slug']}"><img 
                src='/images/${data[key]['image']}'class="smoll-style" alt="${data[key]['slug']}">${data[key]['name']}</a></tr>`;  // название товара, первая строка вся занята гиперссылкой, 4 ячейки в одну
    out += `<tr><td><i class="far fa-minus-square cart-minus" data-goods_id="${key}"></i></td>`; // значок "-", привязка к  id
    out += `<td>${cart[key]}</td>`;
    out += `<td><i class="far fa-plus-square cart-plus" data-goods_id="${key}"></i></td>`;  // значок "+", привязка к  id
    out += `<td>${formatPrice(data[key]['cost']*cart[key]) } руб. </td>` // сумма одного товара =цена*кол-во
    out += `</tr>`;
    amount += cart[key];
    total += cart[key]*data[key]['cost']; 
      }
    out += `<tr><td>Всего:</td> <td>${amount} шт.</td> <td>на сумму</td>  <td colspan="2">${formatPrice(total)} руб.</td> </tr>`; // 3 ячейки в одну
 // out += `<tr><td colspan="3">Total: </td> <td>${formatPrice(total)} uah</td></tr>`; // 3 ячейки в одну
    out += `</tbody></table>`; // выводим таблицу на экран

  document.querySelector('#cart-nav').innerHTML = out; // поле корзины -------------------- cart.pug 15
  document.querySelectorAll('.cart-minus').forEach(function(element){ //вешаем событие на значок "-"
    element.onclick = cartMinus;
  });
  document.querySelectorAll('.cart-plus').forEach(function(element){  //вешаем событие на значок "+"
    element.onclick = cartPlus;
  });
 }

function cartPlus() {
  let goodsId = this.dataset.goods_id;
  cart[goodsId]++;
  ajaxGetGoodsInfo(); //описание товара
  }

function cartMinus() {
  let goodsId = this.dataset.goods_id;
  if (cart[goodsId] -1 > 0){
    cart[goodsId]--;
  }
  else {
    delete(cart[goodsId]);
  }
  ajaxGetGoodsInfo();
 }

function cartZero() {
  for (let key in cart){ 
 // alert(cart[key]);       // количество товара по видам
  cart[key] = 0;
  delete(cart[key]);
  }
 };
  

function cleanCart(data) {
  let out = '<table class="table table-striped table-cart"><tbody>';//вводим данные в виде таблицы
  let total = 0; // сумма товаров в корзине
  let amount = 0;
  out += `<tr><td>Всего:</td> <td>0 шт.</td> <td>на сумму</td>  <td colspan="2">0 руб.</td> </tr>`; // 3 ячейки в одну
  out += `</tbody></table></div>`; // выводим таблицу на экран
  document.querySelector('#cart-nav').innerHTML = out; // вставить поле корзины -------- cart.pug 14
  document.querySelectorAll('.clean-cart').forEach(function(element){  //вешаем событие на значок "+"
     element.onclick = cartZero();
  });

  updateLocalStorageCart(); // сохраняем последнее состояние корзины
};

  
//сохраняем состояние корзины в LocalStorage
function updateLocalStorageCart(){   
  localStorage.setItem('cart', JSON.stringify(cart)); 
}

function formatPrice(price){
  return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') //формат вывода цены
};


