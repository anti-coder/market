document.querySelector('#lite-shop-order0').onsubmit = function (event) {
    event.preventDefault(); //останавливаем перезагрузку страницы
    let login0 = document.querySelector('#login0').value.trim();
    let password0 = document.querySelector('#password0').value.trim();
 //   console.log(login0);

    if (login0 == '' || password0 == '') {
        //не заполнены поля
        Swal.fire({
            title: "Внимание!",
            text: "Заполните логин и пароль",//сообщение заказчику
            type: "info", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит
    }
//   console.log(login0);

     fetch('/signin', {  //app.js str 402
        method: 'POST',
        body: JSON.stringify({
            'login0': login0,
            'password0': password0
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
            console.log(body);//то, что ответил сервер - имя зарегистрированного пользователя
        //    console.log(typeof body);
            if (body !=='0') {   //
            console.log('Входим в кабинет!');
            window.location.href = 'http://localhost:3000/cabinet';//app.js str.467
            document.querySelector('#login0').value = ``;//очищаем поле ввода 
            document.querySelector('#password0').value = ``;//очищаем поле ввода 
       
         }
            else if (body == '0') {
            console.log('Не пойдет! Таких логина и пароля нет!');    
         Swal.fire({
            title: "Не пойдет! Таких логина и пароля нет!", //если сервер не ответил
            text: "Вы не зарегистрированы!",//сообщение заказчику
            type: "error", //определяет цвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит
            }

        else if (!body) {
            console.log('Проблемы с email!');  
         Swal.fire({
            title: "Ошибка!", //если сервер не ответил
            text: "Проблемы с email!",//сообщение заказчику
            type: "error", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит
            }

        })  
}





//получаем данные со всех полей (поэтому парсер не нужен)
document.querySelector('#lite-shop-order').onsubmit = function (event) {
    event.preventDefault(); //останавливаем перезагрузку страницы
    let username = document.querySelector('#username').value.trim();//trim обрезает пробелы справа и слева
    let phone = document.querySelector('#phone1').value.trim();
    let email = document.querySelector('#email').value.trim();
    let address = document.querySelector('#address').value.trim();
    let login = document.querySelector('#login').value.trim();
    let password = document.querySelector('#password').value.trim();


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

    fetch('/register', {  //отправка данных, введенных пользователем, на сервер 
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'phone': phone,
            'address': address,
            'email': email,
            'login': login,
            'password': password
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
            console.log(body);
            if (body == 0) {   //
            Swal.fire({
            title: "Успех!", //если сервер не ответил
            text: "Вы зарегистрированы",//сообщение заказчику
            type: "info", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
            })
        }
            else if (body == 1) {
         Swal.fire({
            title: "Такие логин и пароль уже имеются!", //если сервер не ответил
            text: "Придумайте другие логин и пароль!",//сообщение заказчику
            type: "error", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит
            }

        else {
         Swal.fire({
            title: "Ошибка!", //если сервер не ответил
            text: "Проблемы с email!",//сообщение заказчику
            type: "error", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит
            }


        })
}


