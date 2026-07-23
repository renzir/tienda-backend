
const db = require("../../db/database");

class OrderRepository {
  static async getLockedOrderById(connection, orderId) {
    const [rows] = await connection.execute(
      "SELECT id, estado FROM orden WHERE id = ? FOR UPDATE",
      [orderId],
    );
    return rows[0];
  }

  static async getOrderItems(connection, orderId) {
    const [rows] = await connection.execute(
      "SELECT * FROM ordenitems WHERE orden_id = ?",
      [orderId],
    );
    return rows;
  }

  static async updateStock(
    connection,
    productId,
    deltaAvailable,
    deltaReserved,
    deltaSold,
  ) {
    const conditions = [];
    const values = [];

    if (deltaAvailable !== 0)
      conditions.push("cantidad_disponible = cantidad_disponible + ?");
    if (deltaReserved !== 0)
      conditions.push("cantidad_reservada = cantidad_reservada + ?");
    if (deltaSold !== 0)
      conditions.push("cantidad_vendida = cantidad_vendida + ?");

    if (conditions.length === 0) return;

    // Agregar valores de delta en orden de aparición para mantener consistencia
    if (deltaAvailable !== 0) values.push(deltaAvailable);
    if (deltaReserved !== 0) values.push(deltaReserved);
    if (deltaSold !== 0) values.push(deltaSold);

    values.push(productId); // WHERE id = ? al final

    const query = `UPDATE productos SET ${conditions.join(", ")} WHERE id = ?`;

    return await connection.execute(query, values);
  }

  // Upsert orden item
  static async upsertOrderItem(
    connection,
    orderId,
    productId,
    cantidad,
    precio,
  ) {
    const query = `
      INSERT INTO ordenitems (orden_id, producto_id, cantidad, precio_unitario)
      VALUES (?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad),
                              precio_unitario = VALUES(precio_unitario)
    `;
    await connection.execute(query, [orderId, productId, cantidad, precio]);
  }

  // Operaciones CRUD básicas (sin transacción explícita de negocio)
  static async createOrder(usuario_id, direccion) {
    const [result] = await db.execute(
      "INSERT INTO orden (usuario_id, direccion, estado) VALUES (?, ?, 'pendiente')",
      [usuario_id, direccion],
    );
    return result.insertId;
  }

  static async updateOrderStatus(connection, orderId, newStatus) {
    await connection.execute("UPDATE orden SET estado = ? WHERE id = ?", [
      newStatus,
      orderId,
    ]);
  }

  static async getAllOrders() {
    const [rows] = await db.execute(
      `SELECT o.id, o.usuario_id, o.direccion, o.estado,
              GROUP_CONCAT(oi.producto_id) as product_ids
       FROM orden o
       LEFT JOIN ordenitems oi ON o.id = oi.orden_id
       GROUP BY o.id`,
    );
    return rows;
  }
}

module.exports = OrderRepository;



