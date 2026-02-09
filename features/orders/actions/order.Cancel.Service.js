const db = require("../../../db/database");

async function orderCancelService(orderId) {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // ver que la orden existe y está PENDIENTE
    const [order] = await conn.execute(
      "SELECT estado FROM tienda.orden WHERE id = ? FOR UPDATE",
      [orderId],
    );

    if (order.length === 0) {
      await conn.rollback();
      return { success: false, status: 404, message: "Orden no encontrada" };
    }

    if (order[0].estado !== "pendiente") {
      await conn.rollback();
      return {
        success: false,
        status: 400,
        message: "Solo se pueden cancelar órdenes pendientes",
      };
    }

    // listar todo lo que hay que devolver al stock
    const [items] = await conn.execute(
      "SELECT producto_id, cantidad FROM tienda.ordenitems WHERE orden_id = ?",
      [orderId],
    );

    // devolver stock
    for (const item of items) {
      try {
        await conn.execute(
          `UPDATE tienda.productos 
         SET cantidad_reservada = cantidad_reservada - ?, 
         cantidad_vendida= cantidad_vendida + ? 
         WHERE id = ?`,
          [item.cantidad, item.cantidad, item.producto_id],
        );
      } catch (error) {
        await conn.rollback();
        return {
          success: false,
          status: 400,
          message: "Problemas con stock",
        };
      }
    }

    // cambiar estado de la orden
    await conn.execute(
      "UPDATE tienda.orden SET estado = 'cancelado' WHERE id = ?",
      [orderId],
    );

    await conn.commit();
    return {
      success: true,
      status: 200,
      message: "Orden cancelada y stock devuelto",
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

module.exports = orderCancelService;
