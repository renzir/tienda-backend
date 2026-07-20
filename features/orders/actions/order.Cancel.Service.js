const db = require("../../../db/database");

async function orderCancelService(orderId) {
  try {
    // Validación básica del ID
    if (!orderId || isNaN(orderId)) {
      return { success: false, status: 400, message: "ID de orden inválido" };
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // ver que la orden existe y está PENDIENTE
      const [order] = await conn.execute(
        "SELECT estado FROM orden WHERE id = ? FOR UPDATE",
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
        "SELECT producto_id, cantidad FROM ordenitems WHERE orden_id = ?",
        [orderId],
      );

      // devolver stock
      for (const item of items) {
        try {
          const [updateResult] = await conn.execute(
            `UPDATE productos
         SET cantidad_reservada = cantidad_reservada - ?,
         cantidad_vendida= cantidad_vendida + ?
         WHERE id = ? AND cantidad_reservada >= ?`,
            [item.cantidad, item.cantidad, item.producto_id, item.cantidad],
          );

          if (updateResult.affectedRows === 0) {
            await conn.rollback();
            return {
              success: false,
              status: 400,
              message: `Stock insuficiente para el producto ${item.producto_id}`,
            };
}
        } catch (error) {
          await conn.rollback();
          return {
            success: false,
            status: 400,
            message: `Problemas con stock del producto ${item.producto_id}`,
          };
        }
      }

      // cambiar estado de la orden
      await conn.execute(
        "UPDATE orden SET estado = 'cancelado' WHERE id = ?",
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
      throw new Error(`Error al cancelar la orden: ${error.message}`);
    } finally {
      conn.release();
    }
  } catch (error) {
    throw new Error(`Error al cancelar la orden: ${error.message}`);
  }
}

module.exports = orderCancelService;

