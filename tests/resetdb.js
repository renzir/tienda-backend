const mysql = require("mysql2/promise");
const pool = require("../db/database");

const resetAndSeedDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Desactivar FK checks para poder borrar en cualquier orden
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

    // Limpiar datos de órdenes y productos
    await connection.execute("DELETE FROM ordenitems");
    await connection.execute("DELETE FROM orden");
    await connection.execute("DELETE FROM productos");
    // 1. Añadir limpieza de usuarios
    await connection.execute("DELETE FROM usuarios");

    // Resetear AUTO_INCREMENT
    await connection.execute("ALTER TABLE orden AUTO_INCREMENT = 1");
    await connection.execute("ALTER TABLE productos AUTO_INCREMENT = 1");
    await connection.execute("ALTER TABLE usuarios AUTO_INCREMENT = 1");

    // Sembrar productos iniciales con IDs fijos (importante para tests de órdenes)
    await connection.execute(
      "INSERT INTO productos (id, nombre, precio, cantidad_disponible) VALUES (?, ?, ?, ?)",
      [1, "Test Product 1", 10.99, 100], // Insertar con ID 1
    );
    await connection.execute(
      "INSERT INTO productos (id, nombre, precio, cantidad_disponible) VALUES (?, ?, ?, ?)",
      [2, "Test Product 2", 20.5, 50], // Insertar con ID 2
    );
    await connection.execute(
      "INSERT INTO productos (id, nombre, precio, cantidad_disponible) VALUES (?, ?, ?, ?)",
      [3, "Test Product 3", 25.0, 75], // Insertar con ID 3
    );

    // 2. Insertar un usuario de prueba
    await connection.execute(
      "INSERT INTO usuarios (id, nombre, email, password) VALUES (?, ?, ?, ?)",
      [1, "Test User", "test@test.com", "hash_password"]
    );

    // NOTA: Hemos eliminado la inserción de una orden fija aquí.
    // Las órdenes se crearán dinámicamente en los beforeEach de los tests de órdenes.
    // Reactivar FK checks
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");

    connection.release();
  } catch (error) {
    console.error("Error resetting and seeding database:", error);
    throw error;
  }
};

module.exports = resetAndSeedDatabase;

