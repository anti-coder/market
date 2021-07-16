module.exports = function (request, responce, con, next) { //module.exports позволяет получить доступ к функции извне
    console.log(request.cookies);
    console.log(request.cookies.hash);
    console.log(request.cookies.id);
    if (request.cookies.hash == undefined || request.cookies.id == undefined) {
        responce.redirect('/login');
        return false;
    };
    con.query(
        'SELECT * FROM user WHERE id=' + request.cookies.id + ' and hash="' + request.cookies.hash + '"',
        function (error, result) {
            if (error) reject(error);
            console.log(result);
            if (result.length == 0) {
                console.log('error! user not found!');
                responce.redirect('/login');
            }
            else {
                next();
            }
        });
};