const mysql = require("mysql2/promise");
const pool = require("../db/database");

const resetAndSeedDatabase = async () => {
  try {
    // Connect to the database
    const connection = await pool.getConnection();

    // Clear existing data
    await connection.execute("DELETE FROM productos");
    await connection.execute("ALTER TABLE productos AUTO_INCREMENT = 1");

    // Seed initial data
    await connection.execute(
      "INSERT INTO productos (nombre, precio, cantidad_disponible) VALUES (?, ?, ?)",
      ["Test Product 1", 10.99, 100]
    );
    await connection.execute(
      "INSERT INTO productos (nombre, precio, cantidad_disponible) VALUES (?, ?, ?)",
      ["Test Product 2", 20.50, 50]
    );
    await connection.execute(
        "INSERT INTO productos (nombre, precio, cantidad_disponible) VALUES (?, ?, ?)",
        ["Test Product 3", 25.00, 75]
      );

    connection.release();
  } catch (error) {
    console.error("Error resetting and seeding database:", error);
    throw error;
  }
};

module.exports = resetAndSeedDatabase;
