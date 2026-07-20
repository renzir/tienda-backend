const db = require("../../../db/database");

async function orderAddProductService(order_id, product_id, cantidad, precio) {
  try {
    // Validación básica de entrada
    if (!order_id || isNaN(order_id)) {
      return { success: false, status: 400, message: "ID de orden inválido" };
    }
    if (!product_id || isNaN(product_id)) {
      return { success: false, status: 400, message: "ID de producto inválido" };
    }
    if (!cantidad || cantidad <= 0) {
      return { success: false, status: 400, message: "Cantidad inválida" };
    }
    if (precio === undefined || precio < 0) {
      return { success: false, status: 400, message: "Precio inválido" };
    }

    // conexion única del pool para la transacción
    const conn = await db.getConnection();

    try {
    // inicio de transacción
    await conn.beginTransaction();

    // validar estado de la orden (dentro de la transacción)
    const [orderRows] = await conn.execute(
      "SELECT estado FROM orden WHERE id = ? FOR UPDATE",
      [order_id],
    );

    if (orderRows.length === 0) {
      await conn.rollback();
      return { success: false, status: 404, message: "La orden no existe" };
    }

    if (orderRows[0].estado !== "pendiente") {
      await conn.rollback();
      return {
        success: false,
        status: 400,
        message:
          "No se pueden añadir productos a una orden que no esté pendiente",
      };
    }

    // bloqueo de fila de producto hasta que termine transacción
    const [products] = await conn.execute(
      "SELECT cantidad_disponible FROM productos WHERE id = ? FOR UPDATE",
      [product_id],
    );

    if (products.length === 0) {
      await conn.rollback();
      return { success: false, status: 404, message: "Producto no encontrado" };
    }
    if (products[0].cantidad_disponible < cantidad) {
      await conn.rollback();
      return { success: false, status: 409, message: "Stock insuficiente" };
    }

    // actualiza el stock
    await conn.execute(
      `UPDATE productos
       SET cantidad_disponible = cantidad_disponible - ?, 
           cantidad_reservada = cantidad_reservada + ? 
       WHERE id = ?`,
      [cantidad, cantidad, product_id],
    );

    // inserta o actualiza items
    const upsertQuery = `
      INSERT INTO ordenitems (orden_id, producto_id, cantidad, precio_unitario)
      VALUES (?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)
    `;
    await conn.execute(upsertQuery, [order_id, product_id, cantidad, precio]);

    // cierre de transaccion
    await conn.commit();

    return {
      success: true,
      status: 201,
      message: "Producto añadido correctamente",
    };
  } catch (error) {
    // rollback por si algo falla y lanzamos error
    await conn.rollback();
      throw new Error(`Error al añadir producto a la orden: ${error.message}`);
  } finally {
    // liberar conección
    conn.release();
  }
  } catch (error) {
    throw new Error(`Error al añadir producto a la orden: ${error.message}`);
}
}

module.exports = orderAddProductService;

