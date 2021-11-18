"use strict"
/* Как только страничка загрузилась */
window.onload = function () { 
    /* проверяем поддерживает ли браузер FormData */
if(!window.FormData) { 

//    alert("Браузер не поддерживает загрузку файлов на этом сайте"); 
Swal.fire('Браузер не поддерживает загрузку файлов на этом сайте')
}}

console.clear();


//получаем данные со всех полей
document.querySelector('#gest-message').onsubmit = function (event) {
    event.preventDefault(); //останавливаем перезагрузку страницы
    let gestname1 = document.querySelector('#gestname1').value.trim();//trim обрезает пробелы справа и слева
    let gestphone1 = document.querySelector('#gestphone1').value.trim();
    let gestemail1 = document.querySelector('#gestemail1').value.trim();
    let gestmessage1 = document.querySelector('#gestmessage1').value.trim();
    let code1 = document.querySelector('#code1').value.trim();
    code1 = 'lijkghgfsxhcyjyujnojyggwdxgnhmhjblkjgx';


    if (!document.querySelector('#rule1').checked) {
        //клиент с правилами не согласен
        Swal.fire({
            title: "Внимание!",
            text: "Прочтите и примите условия",//сообщение заказчику
            type: "info", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит
    }

    if (gestname1 == '' || gestphone1 == '' || gestemail1 == '' || gestmessage1 == '') {
        //не заполнены поля
        Swal.fire({
            title: "Внимание!",
            text: "Заполните все поля",//сообщение заказчику
            type: "info", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит
    }


    fetch('/contacts', {  //отправка данных, введенных пользователем, на сервер 
        method: 'POST',
        body: JSON.stringify({
            'gestname1': gestname1,
            'gestphone1': gestphone1,
            'gestemail1': gestemail1,
            'gestmessage1': gestmessage1,
            'code1': code1
            
        }),
        headers: { // это нужно, если отправляю в JSON-формате
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
     //   console.log(response);
        console.log(response.status);
        if (response.status == 200 & response.ok == true)
        return response.text();//}//ответ-текстовый файл
    })
        .then(function (body) { //тело запроса
            if (body == '1') {   
            Swal.fire({
            title: "Успех!", //если сервер ответил
            text: "Сообщение отправлено!",//сообщение заказчику
            type: "info", //определяетцвет на кружке и вывод
            confirmButtonText: "Ok" 
            })
        }
            else {
        Swal.fire({
            title: "Сообщение не отправлено", 
            text: "Ошибка!",
            type: "error", 
            confirmButtonText: "Ok" 
        });
        return false; //чтобы выйти из функции, отправка формы не происходит

            }
        })
        
}
