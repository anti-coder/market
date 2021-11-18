function sendLoginAdmin() {
    //fetch-запрос, узнаем, что сделал пользователь на сайте 
    fetch('/loginAdmin', {
        method: 'POST',
        body: JSON.stringify({
            'loginAdmin': document.querySelector('#loginAdmin').value,
            'passwordAdmin': document.querySelector('#passwordAdmin').value,
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

document.querySelector('form').onsubmit = function (event) {
    event.preventDefault();
    sendLoginAdmin();
}