const mysql = require("mysql2/promise");

const pool = process.env.MYSQL_URL
  ? mysql.createPool(process.env.MYSQL_URL)
  : mysql.createPool({
      host: "127.0.0.1",
      port: 3306,
      user: "renzi",
      password: "919540",
      database: "tienda",
      dateStrings: true,
    });

module.exports = pool;
