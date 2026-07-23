const OrderRepository = require("./order.repository");
const TransactionManager = require("../../db/transaction"); 
const { AppError } = require("../../middleware/errorHandler");
const db = require("../../db/database"); 

class OrderService {
  /**
   * Crea una nueva orden
   */
  static async createOrder(usuario_id, direccion) {
    if (!usuario_id || !direccion) {
      throw new AppError("Faltan datos requeridos", 400);
    }

    const orderId = await OrderRepository.createOrder(usuario_id, direccion);
    return { success: true, orderId };
  }

  /**
   * Obtiene orden por ID (incluye items y productos)
   */
  static async getOrderDetails(orderId) {
    const [rows] = await db.execute(
      // Usamos db directamente para consultas de solo lectura sin transacción
      `SELECT o.id AS order_id, o.usuario_id, o.direccion, o.estado,
              oi.producto_id, oi.cantidad, oi.precio_unitario,
              p.nombre AS producto_nombre, p.precio AS producto_precio
       FROM orden o
       LEFT JOIN ordenitems oi ON o.id = oi.orden_id
       LEFT JOIN productos p ON oi.producto_id = p.id
       WHERE o.id = ?`,
      [orderId],
    );

    if (rows.length === 0) {
      return null; // O lanzar un AppError si prefieres que el controlador lo maneje
    }

    // Reestructurar los resultados para agrupar los items de la orden
    const orderDetails = {
      id: rows[0].order_id,
      usuario_id: rows[0].usuario_id,
      direccion: rows[0].direccion,
      estado: rows[0].estado,
      items: [],
    };

    rows.forEach((row) => {
      if (row.producto_id) {
        // Solo si hay items asociados a la orden
        orderDetails.items.push({
          producto_id: row.producto_id,
          cantidad: row.cantidad,
          precio_unitario: row.precio_unitario,
          producto_nombre: row.producto_nombre,
          // producto_precio: row.producto_precio // Ya tenemos precio_unitario, este puede ser redundante o usarlo para validación
        });
      }
    });

    return orderDetails;
  }

  static async getOrdersList() {
    return await OrderRepository.getAllOrders();
  }

  /**
   * Añade producto a la orden. Maneja stock y transacción interna.
   */
  static async addProductToOrder(orderId, productId, cantidad, precio) {
    if (cantidad <= 0 || precio < 0) {
      throw new AppError("Datos inválidos para el producto", 400);
    }

    return await TransactionManager.executeWithTransaction(async (conn) => {
      const order = await OrderRepository.getLockedOrderById(conn, orderId);
      if (!order) throw new AppError("Orden no encontrada", 404);
      if (order.estado !== "pendiente")
        throw new AppError("La orden ya está procesada o cancelada", 400);

      const [products] = await conn.execute(
        "SELECT cantidad_disponible FROM productos WHERE id = ? FOR UPDATE",
        [productId],
      );

      if (!products.length) throw new AppError("Producto inexistente", 404);
      if (products[0].cantidad_disponible < cantidad) {
        throw new AppError("Stock insuficiente del proveedor", 409);
      }

      await OrderRepository.updateStock(
        conn,
        productId,
        -cantidad,
        +cantidad,
        0,
      );

      // Insertamos/Actualizamos item
      await OrderRepository.upsertOrderItem(
        conn,
        orderId,
        productId,
        cantidad,
        precio,
      );

      return { message: "Producto añadido y stock reservado" };
    });
  }

  /**
   * Elimina un producto de la orden
   */
  static async removeProductFromOrder(orderId, productId) {
    return await TransactionManager.executeWithTransaction(async (conn) => {
      const order = await OrderRepository.getLockedOrderById(conn, orderId);
      if (!order) throw new AppError("Orden no encontrada", 404);
      if (order.estado !== "pendiente")
        throw new AppError("Solo se pueden modificar órdenes pendientes", 400);

      const items = await OrderRepository.getOrderItems(conn, orderId);
      const item = items.find((i) => i.producto_id == productId);
      if (!item) throw new AppError("Producto no encontrado en la orden", 404);

      await OrderRepository.updateStock(
        conn,
        productId,
        +item.cantidad,
        -item.cantidad,
        0,
      );

      await conn.execute(
        "DELETE FROM ordenitems WHERE orden_id = ? AND producto_id = ?",
        [orderId, productId],
      );

      return { message: "Producto eliminado y stock liberado" };
    });
  }
  /**
   * Cancela la orden y devuelve stock disponible.
   */
  static async cancelOrder(orderId) {
    return await TransactionManager.executeWithTransaction(async (conn) => {
      const order = await OrderRepository.getLockedOrderById(conn, orderId);

      if (!order) throw new AppError("Orden no encontrada", 404);
      if (order.estado !== "pendiente")
        throw new AppError("Solo se pueden cancelar órdenes pendientes", 400);

      const items = await OrderRepository.getOrderItems(conn, orderId);

      for (const item of items) {
        const [check] = await conn.execute(
          "SELECT cantidad_reservada FROM productos WHERE id = ? FOR UPDATE",
          [item.producto_id],
        );

        if (check[0].cantidad_reservada < item.cantidad) {
          throw new AppError(
            `Stock reservado insuficiente para el producto ${item.producto_id}`,
            400,
          );
        }
        await OrderRepository.updateStock(
          conn,
          item.producto_id,
          +item.cantidad,
          -item.cantidad,
          0,
        );
      }

      await OrderRepository.updateOrderStatus(conn, orderId, "cancelado");
      await conn.execute("DELETE FROM ordenitems WHERE orden_id = ?", [
        orderId,
      ]);

      return { message: "Orden cancelada y stock liberado" };
    });
  }

  /**
   * Confirma la orden. Mueve stock a "Vendida".
   */
  static async confirmOrder(orderId) {
    return await TransactionManager.executeWithTransaction(async (conn) => {
      const order = await OrderRepository.getLockedOrderById(conn, orderId);
      if (!order) throw new AppError("Orden no encontrada", 404);
      if (order.estado !== "pendiente")
        throw new AppError("Solo se pueden confirmar órdenes pendientes", 400);

      const items = await OrderRepository.getOrderItems(conn, orderId);

      if (items.length === 0) {
        throw new AppError("La orden no tiene productos", 400);
      }

      for (const item of items) {
        const [products] = await conn.execute(
          "SELECT cantidad_disponible, cantidad_reservada FROM productos WHERE id = ? FOR UPDATE",
          [item.producto_id],
        );

        if (!products.length)
          throw new AppError(`Producto ${item.producto_id} no encontrado`, 404);

        if (products[0].cantidad_reservada < item.cantidad) {
          throw new AppError(
            `Stock reservado insuficiente para el producto ${item.producto_id}. Reservado: ${products[0].cantidad_reservada}, Necesario: ${item.cantidad}`,
            409,
          );
        }
      }
      for (const item of items) {
        await OrderRepository.updateStock(
          conn,
          item.producto_id,
          0, 
          -item.cantidad, 
          +item.cantidad, 
        );
      }

      await OrderRepository.updateOrderStatus(conn, orderId, "confirmada");

      return { message: "Orden confirmada y stock vendido" };
    });
  }
}

module.exports = OrderService;
