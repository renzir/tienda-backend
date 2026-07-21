// ... existing code ...
const db = require("../../db/database");

const Product = {
  create: async (nombre, precio, cantidad_disponible) => {
    const [result] = await db.execute(
      "INSERT INTO productos (nombre, precio, cantidad_disponible) VALUES (?, ?, ?)",
      [nombre, precio, cantidad_disponible]
    );
    return result.affectedRows === 1;
  },
  delete: async (id) => {
    const [result] = await db.execute("DELETE FROM productos WHERE id = ?", [id]);
    return result.affectedRows === 1;
  },
  findAll: async () => {
    const [products] = await db.execute("SELECT * FROM productos");
    return products;
  },
  findById: async (id) => {
    const [products] = await db.execute("SELECT * FROM productos WHERE id = ?", [id]);
    return products[0] || null;
  },
  findByName: async (nombre) => {
    const [rows] = await db.execute("SELECT * FROM productos WHERE nombre = ?", [nombre]);
    return rows[0] || null;
  },
  update: async (nombre, precio, cantidad_disponible, cantidad_reservada, id) => {
    const [result] = await db.execute(
      "UPDATE productos SET nombre = ?, precio = ?, cantidad_disponible = ?, cantidad_reservada = ? WHERE id = ?",
      [nombre, precio, cantidad_disponible, cantidad_reservada, id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Product;
