const mysql = require("mysql2/promise");

const pool = process.env.MYSQL_URL
  ? mysql.createPool(process.env.MYSQL_URL)
  : mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 3307,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "1234",
      database: process.env.DB_NAME || "tienda",
      dateStrings: true,
    });

module.exports = pool;
