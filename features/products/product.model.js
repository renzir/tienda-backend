const db = require("../../db/database");

const Product = {
  create: async (nombre, precio, cantidad_disponible, categoria, descripcion) => {
    const [result] = await db.execute(
      "INSERT INTO productos (nombre, precio, cantidad_disponible, categoria, descripcion) VALUES (?, ?, ?, ?, ?)",
      [nombre, precio, cantidad_disponible, categoria || null, descripcion || null]
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
  update: async (
    nombre,
    precio,
    cantidad_disponible,
    cantidad_reservada,
    categoria,
    descripcion,
    id
  ) => {
    const [result] = await db.execute(
      "UPDATE productos SET nombre = ?, precio = ?, cantidad_disponible = ?, cantidad_reservada = ?, categoria = ?, descripcion = ? WHERE id = ?",
      [
        nombre,
        precio,
        cantidad_disponible,
        cantidad_reservada,
        categoria !== undefined ? categoria : null,
        descripcion !== undefined ? descripcion : null,
        id,
      ]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Product;