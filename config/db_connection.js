var mysql = require('mysql')

module.exports.connection = function () {
    return mysql.createConnection({
        host    : 'localhost',
        user     : 'root',
        password : 'root',
        database:'gobumpr',
        port: 3306,
    });
}
// var Client = require('mysql').Client;
// client = new Client();
// client.host ='some.host.com';
// client.user = 'user';
// client.password = 'password';