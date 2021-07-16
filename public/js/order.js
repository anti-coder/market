//получаем данные со всех полей
document.querySelector('#lite-shop-order').onsubmit = function (event) {
    event.preventDefault(); //останавливаем перезагрузку страницы
    let username = document.querySelector('#username').value.trim();//trim обрезает пробелы справа и слева
    let phone = document.querySelector('#phone').value.trim();
    let email = document.querySelector('#email').value.trim();
    let address = document.querySelector('#address').value.trim();

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

    if (username == '' || phone == '' || email == '' || address == '') {
        //не заполнены поля
        Swal.fire({
            title: "Внимание!",
            text: "Заполните все поля",//сообщение заказчику
            type: "info", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит
    }

    fetch('/finish-order', {  //отправка данных, введенных пользователем, на сервер 
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'phone': phone,
            'address': address,
            'email': email,
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
            else {
        Swal.fire({
            title: "Проблемы с email", //если сервер не ответил
            text: "Ошибка!",//сообщение заказчику
            type: "error", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит

            }
        })
}

