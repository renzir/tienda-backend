const db = require("../../../db/database");

async function confirmOrderService(orderId) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // verificar que la orden existe y está pendiente
    const [order] = await conn.execute(
      "SELECT estado FROM tienda.orden WHERE id = ? FOR UPDATE",
      [orderId],
    );

    if (!order.length || order[0].estado !== "pendiente") {
      await conn.rollback();
      return {
        success: false,
        status: 400,
        message: "La orden no se puede confirmar",
      };
    }

    // movemos stock de reservada a vendida
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
    // cambiar estado a confirmado 
    await conn.execute(
      "UPDATE tienda.orden SET estado = 'confirmado' WHERE id = ?",
      [orderId],
    );
    await conn.commit();
    return {
      success: true,
      status: 200,
      message: "Orden confirmada con éxito",
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
module.exports = confirmOrderService;
