const db = require("../../../db/database");

async function orderRemoveService(orderId, productId) {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();
    // validar estado de la orden (dentro de la transacción)
    const [orderRowsRemove] = await conn.execute(
      "SELECT estado FROM tienda.orden WHERE id = ? FOR UPDATE",
      [orderId],
    );

    if (orderRowsRemove.length === 0) {
      await conn.rollback();
      return { success: false, status: 404, message: "La orden no existe" };
    }

    if (orderRowsRemove[0].estado !== "pendiente") {
      await conn.rollback();
      return {
        success: false,
        status: 400,
        message:
          "No se pueden añadir productos a una orden que no esté pendiente",
      };
    }

    //  ver si el producto está en la orden
    const [orderRows] = await conn.execute(
      "SELECT cantidad FROM tienda.ordenitems WHERE orden_id = ? AND producto_id = ? FOR UPDATE",
      [orderId, productId],
    );

    if (orderRows.length === 0) {
      await conn.rollback();
      return {
        success: false,
        status: 404,
        message: "El producto no está en la orden",
      };
    }

    const cantidadEnOrden = orderRows[0].cantidad;

    // devolvemos 1 unidad al inventario disponible
    const [stockUpdate] = await conn.execute(
      `UPDATE tienda.productos 
       SET cantidad_disponible = cantidad_disponible + 1, 
           cantidad_reservada = cantidad_reservada - 1 
       WHERE id = ? AND cantidad_reservada > 0`,
      [productId],
    );

    if (stockUpdate.affectedRows === 0) {
      await conn.rollback();
      return {
        success: false,
        status: 409,
        message: "Error: no hay reservas que devolver",
      };
    }

    // si solo hay 1 borramos. Sino restamos 1.
    if (cantidadEnOrden === 1) {
      await conn.execute(
        "DELETE FROM tienda.ordenitems WHERE orden_id = ? AND producto_id = ?",
        [orderId, productId],
      );
    } else {
      await conn.execute(
        "UPDATE tienda.ordenitems SET cantidad = cantidad - 1 WHERE orden_id = ? AND producto_id = ?",
        [orderId, productId],
      );
    }

    await conn.commit();
    return {
      success: true,
      status: 201,
      message: "Producto actualizado en la orden",
    };
  } catch (error) {
    await conn.rollback();

    throw error;
  } finally {
    conn.release();
  }
}

module.exports = orderRemoveService;
