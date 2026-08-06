const db = require("./database");

class TransactionManager {
  static async executeWithTransaction(fn) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const result = await fn(connection);
      await connection.commit();
      return result;
      } catch (error) {
      await connection.rollback();
      console.error("Transaction failed:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = TransactionManager;
