const db = require("../../../db/database");

async function confirmOrderService(orderId) {
  try {
    // Validación básica del ID
    if (!orderId || isNaN(orderId)) {
      return { success: false, status: 400, message: "ID de orden inválido" };
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // verificar que la orden existe y está pendiente
      const [order] = await conn.execute(
        "SELECT estado FROM orden WHERE id = ? FOR UPDATE",
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
        "SELECT producto_id, cantidad FROM ordenitems WHERE orden_id = ?",
        [orderId],
      );

      // actualizar stock
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

      // cambiar estado a confirmado
      await conn.execute(
        "UPDATE orden SET estado = 'confirmado' WHERE id = ?",
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
      throw new Error(`Error al confirmar la orden: ${error.message}`);
    } finally {
      conn.release();
    }
  } catch (error) {
    throw new Error(`Error al confirmar la orden: ${error.message}`);
  }
}

module.exports = confirmOrderService;

