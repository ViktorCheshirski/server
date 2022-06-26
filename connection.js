const mysql = require("mysql2");
const fs = require('fs')

const connection = mysql.createConnection({
    host     : 'rc1a-jt0lag1penb5wizc.mdb.yandexcloud.net',
    port     : 3306,
    user     : 'master-user',
    password : 'qwertyuiop',
    database : 'ptototype_bd',
    ssl  : {
      ca : fs.readFileSync('C:/Users/Acer/.mysql/root.crt'),
    }
})
module.exports = {connection};