const mysql = require("mysql2/promise");

const pool = process.env.MYSQL_URL
  ? mysql.createPool(process.env.MYSQL_URL)
  : mysql.createPool({
      host: "127.0.0.1",
      port: 3307,
      user: "root",
      password: "1234",
      database: "tienda",
      dateStrings: true,
    });

module.exports = pool;
