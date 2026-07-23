// tests/order.service.test.js
const OrderService = require("./../features/orders/order.service");
const TransactionManager = require("./../db/transaction");
const OrderRepository = require("./../features/orders/order.repository");
const { AppError } = require("./../middleware/errorHandler");

// Mockear las dependencias antes de importar el servicio
jest.mock("./../db/transaction", () => ({
  executeWithTransaction: jest.fn(),
}));

jest.mock("../features/orders/order.repository", () => ({
  createOrder: jest.fn(),
  getOrderDetails: jest.fn(),
  getLockedOrderById: jest.fn(),
  updateStock: jest.fn(),
  upsertOrderItem: jest.fn(),
  cancelOrder: jest.fn(),
  getOrderItems: jest.fn(),
  updateOrderStatus: jest.fn(),
}));

describe("Unit: OrderService (Logic Layer)", () => {
  beforeEach(() => {
    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe("addProductToOrder", () => {
    it("should add product successfully when stock is available", async () => {
      // Arrange
      const orderId = 1;
      const productId = 5;
      const mockOrder = { id: orderId, estado: "pendiente" };

      // Configurar el stub de transacción para simular que la llamada interna a repository funciona
      TransactionManager.executeWithTransaction.mockImplementation(
        async (callback) => {
          const mockConn = { execute: jest.fn() };

          // Simular la lógica interna del callback: obtener orden y verificar stock
          OrderRepository.getLockedOrderById.mockResolvedValue(mockOrder);

          // Simular que el check de stock pasa (hay disponible)
          mockConn.execute.mockResolvedValue([[{ cantidad_disponible: 10 }]]);

          // Ejecutar el callback del servicio pasando la conexión simulada
          return await callback(mockConn);
        },
      );

      // Act
      const result = await OrderService.addProductToOrder(
        orderId,
        productId,
        1,
        50,
      );

      // Assert
      expect(result.message).toBe("Producto añadido y stock reservado");
      expect(OrderRepository.getLockedOrderById).toHaveBeenCalledTimes(1);
      expect(TransactionManager.executeWithTransaction).toHaveBeenCalledTimes(
        1,
      );
    });

    it("should throw 409 Conflict when stock is insufficient", async () => {
      // Arrange
      TransactionManager.executeWithTransaction.mockImplementation(
        async (callback) => {
          const mockConn = { execute: jest.fn() };
          OrderRepository.getLockedOrderById.mockResolvedValue({
            id: 1,
            estado: "pendiente",
          });

          // Simular stock insuficiente en la DB simulada
          mockConn.execute.mockResolvedValue([[{ cantidad_disponible: 0 }]]);

          await callback(mockConn);
        },
      );

      // Act & Assert
      await expect(
        OrderService.addProductToOrder(1, 5, 10, 50),
      ).rejects.toThrow("Stock insuficiente del proveedor");
    });

    it("should throw 404 if order not found", async () => {
      // Arrange
      TransactionManager.executeWithTransaction.mockImplementation(
        async (callback) => {
          OrderRepository.getLockedOrderById.mockResolvedValue(null);
          await callback({});
        },
      );

      // Act & Assert
      await expect(
        OrderService.addProductToOrder(999, 1, 1, 10),
      ).rejects.toThrow("Orden no encontrada");
    });
  });

  describe("confirmOrder", () => {
    it("should confirm order and move stock to sold", async () => {
      // Arrange
      const orderId = 1;
      const mockOrder = { id: orderId, estado: "pendiente" };
      const mockItems = [{ producto_id: 1, cantidad: 2 }];

      TransactionManager.executeWithTransaction.mockImplementation(
        async (callback) => {
          const mockConn = { execute: jest.fn() };

          OrderRepository.getLockedOrderById.mockResolvedValue(mockOrder);
          OrderRepository.getOrderItems.mockResolvedValue(mockItems);

          // Simular que la consulta de stock para confirmación devuelve suficiente reserva
          mockConn.execute.mockResolvedValue([
            [{ cantidad_disponible: 10, cantidad_reservada: 5 }],
          ]);

          // Añadir retorno explícito para la función del callback
          return await callback(mockConn);
        },
      );

      // Act
      const result = await OrderService.confirmOrder(orderId);
      // Assert
      expect(result.message).toBe("Orden confirmada y stock vendido");
      expect(OrderRepository.getOrderItems).toHaveBeenCalled();
    });

    it("should throw 400 if trying to confirm non-pending order", async () => {
      // Arrange
      TransactionManager.executeWithTransaction.mockImplementation(
        async (callback) => {
          OrderRepository.getLockedOrderById.mockResolvedValue({
            id: 1,
            estado: "confirmada",
          });
          return await callback({}); // Añadido return await
        },
      );

      // Act & Assert
      await expect(OrderService.confirmOrder(1)).rejects.toThrow(
        "Solo se pueden confirmar órdenes pendientes",
      );
    });
  });
});
