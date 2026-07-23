const OrderService = require("./order.service"); 
const AppError = require("../../middleware/errorHandler").AppError;

class OrderController {
  /**
   * GET /orders
   * Lista todas las órdenes o busca por ID
   */
  static async getOrders(req, res, next) {
    try {
      const { id } = req.params;

      
      if (id) {
        const orderDetails = await OrderService.getOrderDetails(id);

        if (!orderDetails) {
          throw new AppError("Orden no encontrada", 404);
        }

        return res.status(200).json({
          success: true,
          data: orderDetails,
        });
      }

      const allOrders = await OrderService.getOrdersList();

      return res.status(200).json({
        success: true,
        count: allOrders.length,
        data: allOrders,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /orders
   * Crea una nueva orden
   */
  static async createOrder(req, res, next) {
    try {
      const { usuario_id, direccion } = req.body; 

      if (!usuario_id || !direccion) {
        return res.status(400).json({
          success: false,
          message: "Faltan campos obligatorios: usuario_id y direccion",
        });
      }

      const result = await OrderService.createOrder(usuario_id, direccion);

      return res.status(201).json({
        success: true,
        message: "Orden creada correctamente",
        data: { orderId: result.orderId },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /orders/:id/add-product
   * Añade un producto a una orden pendiente
   */
  static async addProduct(req, res, next) {
    try {
      const { id, productId } = req.params; 
      const { cantidad, precio } = req.body;
      if (!productId || !cantidad || precio === undefined) {
        throw new AppError("Datos incompletos para añadir producto", 400);
      }

      const result = await OrderService.addProductToOrder(
        id,
        productId,
        cantidad,
        precio,
      );

      return res.status(201).json({
        success: true,
        message: result.message || "Producto añadido a la orden",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /orders/:id/cancel
   * Cancela una orden pendiente y libera stock
   */
  static async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;

      const result = await OrderService.cancelOrder(id);

      return res.status(200).json({
        success: true,
        message: result.message || "Orden cancelada y stock liberado",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /orders/:id/confirm
   * Confirma una orden y mueve stock a vendido
   */
  static async confirmOrder(req, res, next) {
    try {
      const { id } = req.params;

      const result = await OrderService.confirmOrder(id);

      return res.status(200).json({
        success: true,
        message: result.message || "Orden confirmada con éxito",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /orders/:id/remove-product
   * Elimina un producto de la orden (o resta cantidad)
   */
  static async removeProduct(req, res, next) {
    try {
      const { id: orderId, productId } = req.params; 

      if (!productId) {
        throw new AppError("Falta el ID del producto a eliminar", 400);
      }

      const result = await OrderService.removeProductFromOrder(
        orderId,
        productId,
      );

      return res.status(200).json({
        success: true,
        message: result.message || "Producto eliminado/actualizado en la orden",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /orders/:id
   * Obtiene los detalles de una orden específica.
   * Esta función FALTABA en tu controlador anterior.
   */
  static async getOrderDetails(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Se requiere un ID de orden",
        });
      }

      const orderDetails = await OrderService.getOrderDetails(id);

      if (!orderDetails) {
        return res.status(404).json({
          success: false,
          error: "Orden no encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        data: orderDetails,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
