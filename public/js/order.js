//получаем данные со всех полей
document.querySelector('#lite-shop-order').onsubmit = function (event) {
    event.preventDefault(); //останавливаем перезагрузку страницы
    let login = document.querySelector('#login').value.trim();//trim обрезает пробелы справа и слева
    let password = document.querySelector('#password').value.trim();
    

    if (login == '' || password == '') {
        //не заполнены поля
        Swal.fire({
            title: "Внимание!",
            text: "Заполните все поля!",//сообщение заказчику
            type: "info", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит
    }

    fetch('/finish-order', {  //app.js str.486
        method: 'POST',
        body: JSON.stringify({
            'login': login,
            'password': password,
            'key': JSON.parse(localStorage.getItem('cart'))//ключи товаров в корзине, отсылается вся корзина
        }),
        headers: { // это нужно, если отправляю в JSON-формате
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            console.log(response);
            return response.text();//ответ от сервера преобразуем в нужную форму
        })
        .then(function (body) { //тело запроса
            console.log(body);
            if (body == 1) {   //
            Swal.fire({
            title: "Успех!", //если сервер не ответил
            text: "Заказ оформлен",//сообщение заказчику
            type: "info", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
            })
        }
            else if (body == 0) {
        Swal.fire({
            title: "Вы не зарегистроированы!", //если сервер не ответил
            text: "Таких логина и пароля в базе данных нет!",//сообщение заказчику
            type: "error", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит
            }

        
        else if (body == 2){
         Swal.fire('Ваша корзина пуста!');
        return false; //чтобы выйти из функции, отправка формы не происходит
            }
        })
}


//получаем данные со всех полей
document.querySelector('#order-gest').onsubmit = function (event) {
    event.preventDefault(); //останавливаем перезагрузку страницы
    let gestname = document.querySelector('#gestname').value.trim();//trim обрезает пробелы справа и слева
    let gestphone = document.querySelector('#gestphone').value.trim();
    let gestemail = document.querySelector('#gestemail').value.trim();
    let gestaddress = document.querySelector('#gestaddress').value.trim();

    if (!document.querySelector('#rule').checked) {
        //клиент с правилами не согласен
        Swal.fire({
            title: "Внимание!",
            text: "Прочтите и примите условия",//сообщение заказчику
            type: "info", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит
    }

    if (gestname == '' || gestphone == '' || gestemail == '' || gestaddress == '') {
        //не заполнены поля
        Swal.fire({
            title: "Внимание!",
            text: "Заполните все поля",//сообщение заказчику
            type: "info", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит
    }


    fetch('/finish-order-gest', {  //app.js str.572
        method: 'POST',
        body: JSON.stringify({
            'gestname': gestname,
            'gestphone': gestphone,
            'gestemail': gestemail,
            'gestaddress': gestaddress,
            'key': JSON.parse(localStorage.getItem('cart'))//ключи товаров в корзине, отсылается вся корзина
        }),
        headers: { // это нужно, если отправляю в JSON-формате
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.text();//ответ от сервера преобразуем в нужную форму
        })
        .then(function (body) { //тело запроса
            if (body == 1) {   //
            Swal.fire({
            title: "Успех!", //если сервер не ответил
            text: "Заказ оформлен",//сообщение заказчику
            type: "info", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
            })
        }
            else if (body == 2){
         Swal.fire('Ваша корзина пуста!');
        
        return false; //чтобы выйти из функции, отправка формы не происходит

            }
        })
}

