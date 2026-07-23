const db = require("../../db/database");

class UserRepository {
  /**
   * Busca un usuario por email
   */
  static async findByEmail(email) {
    const [rows] = await db.execute(
      "SELECT id, nombre, email, password FROM usuarios WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Inserta un nuevo usuario y devuelve el ID generado
   */
  static async create({ nombre, email, password }) {
    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, password]
    );
    return result.insertId;
  }

  /**
   * Busca un usuario por ID (útil para generar datos completos si fuera necesario)
   */
  static async findById(id) {
    const [rows] = await db.execute(
      "SELECT id, nombre, email FROM usuarios WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  }
}

module.exports = UserRepository;