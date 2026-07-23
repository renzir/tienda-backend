const db = require("./database");

class TransactionManager {
  // Ejecuta una función dentro de una transacción segura
  static async executeWithTransaction(fn) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // La función recibe la conexión para usarla explícitamente
      const result = await fn(connection);

      await connection.commit();
      return result; // Return result directly, no need for wrapper object if service handles it
    } catch (error) {
      await connection.rollback();
      console.error("Transaction failed:", error); // Add logging
      throw error; // Relanzamos el error al llamador
    } finally {
      connection.release();
    }
  }
}

module.exports = TransactionManager;
