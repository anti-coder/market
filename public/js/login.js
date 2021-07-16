function sendLogin() {
    //fetch-запрос, узнаем, что сделал пользователь на сайте 
    fetch('/login', {
        method: 'POST',
        body: JSON.stringify({
            'login': document.querySelector('#login').value,
            'password': document.querySelector('#password').value,
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

document.querySelector('form').onsubmit = function (event) {
    event.preventDefault();
    sendLogin();
}