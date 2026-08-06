const mysql = require("mysql2/promise");
const pool = require("../db/database");

const resetAndSeedDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
    await connection.execute("DELETE FROM ordenitems");
    await connection.execute("DELETE FROM orden");
    await connection.execute("DELETE FROM productos");
    await connection.execute("DELETE FROM usuarios");

    await connection.execute("ALTER TABLE orden AUTO_INCREMENT = 1");
    await connection.execute("ALTER TABLE productos AUTO_INCREMENT = 1");
    await connection.execute("ALTER TABLE usuarios AUTO_INCREMENT = 1");

    await connection.execute(
      "INSERT INTO productos (id, nombre, precio, cantidad_disponible) VALUES (?, ?, ?, ?)",
      [1, "Test Product 1", 10.99, 100], 
    );
    await connection.execute(
      "INSERT INTO productos (id, nombre, precio, cantidad_disponible) VALUES (?, ?, ?, ?)",
      [2, "Test Product 2", 20.5, 50], 
    );
    await connection.execute(
      "INSERT INTO productos (id, nombre, precio, cantidad_disponible) VALUES (?, ?, ?, ?)",
      [3, "Test Product 3", 25.0, 75], 
    );

    await connection.execute(
      "INSERT INTO usuarios (id, nombre, email, password) VALUES (?, ?, ?, ?)",
      [1, "Test User", "test@test.com", "hash_password"]
    );

    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");

    connection.release();
  } catch (error) {
    console.error("Error resetting and seeding database:", error);
    throw error;
  }
};

module.exports = resetAndSeedDatabase;

