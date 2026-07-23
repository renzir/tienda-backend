// tests/order.service.test.js
const OrderService = require("./../features/orders/order.service");
const TransactionManager = require("./../db/transaction");
const OrderRepository = require("./../features/orders/order.repository");
const { AppError } = require("./../middleware/errorHandler");

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
    jest.clearAllMocks();
  });

  describe("addProductToOrder", () => {
    it("should add product successfully when stock is available", async () => {
      const orderId = 1;
      const productId = 5;
      const mockOrder = { id: orderId, estado: "pendiente" };

      TransactionManager.executeWithTransaction.mockImplementation(
        async (callback) => {
          const mockConn = { execute: jest.fn() };

          OrderRepository.getLockedOrderById.mockResolvedValue(mockOrder);

          mockConn.execute.mockResolvedValue([[{ cantidad_disponible: 10 }]]);

          return await callback(mockConn);
        },
      );

      const result = await OrderService.addProductToOrder(
        orderId,
        productId,
        1,
        50,
      );

      expect(result.message).toBe("Producto añadido y stock reservado");
      expect(OrderRepository.getLockedOrderById).toHaveBeenCalledTimes(1);
      expect(TransactionManager.executeWithTransaction).toHaveBeenCalledTimes(
        1,
      );
    });

    it("should throw 409 Conflict when stock is insufficient", async () => {
      TransactionManager.executeWithTransaction.mockImplementation(
        async (callback) => {
          const mockConn = { execute: jest.fn() };
          OrderRepository.getLockedOrderById.mockResolvedValue({
            id: 1,
            estado: "pendiente",
          });

          mockConn.execute.mockResolvedValue([[{ cantidad_disponible: 0 }]]);

          await callback(mockConn);
        },
      );

      await expect(
        OrderService.addProductToOrder(1, 5, 10, 50),
      ).rejects.toThrow("Stock insuficiente del proveedor");
    });

    it("should throw 404 if order not found", async () => {
      TransactionManager.executeWithTransaction.mockImplementation(
        async (callback) => {
          OrderRepository.getLockedOrderById.mockResolvedValue(null);
          await callback({});
        },
      );

      await expect(
        OrderService.addProductToOrder(999, 1, 1, 10),
      ).rejects.toThrow("Orden no encontrada");
    });
  });

  describe("confirmOrder", () => {
    it("should confirm order and move stock to sold", async () => {
      const orderId = 1;
      const mockOrder = { id: orderId, estado: "pendiente" };
      const mockItems = [{ producto_id: 1, cantidad: 2 }];

      TransactionManager.executeWithTransaction.mockImplementation(
        async (callback) => {
          const mockConn = { execute: jest.fn() };

          OrderRepository.getLockedOrderById.mockResolvedValue(mockOrder);
          OrderRepository.getOrderItems.mockResolvedValue(mockItems);

          mockConn.execute.mockResolvedValue([
            [{ cantidad_disponible: 10, cantidad_reservada: 5 }],
          ]);

          return await callback(mockConn);
        },
      );

      // Act
      const result = await OrderService.confirmOrder(orderId);
      expect(result.message).toBe("Orden confirmada y stock vendido");
      expect(OrderRepository.getOrderItems).toHaveBeenCalled();
    });

    it("should throw 400 if trying to confirm non-pending order", async () => {
      TransactionManager.executeWithTransaction.mockImplementation(
        async (callback) => {
          OrderRepository.getLockedOrderById.mockResolvedValue({
            id: 1,
            estado: "confirmada",
          });
          return await callback({}); 
        },
      );

      await expect(OrderService.confirmOrder(1)).rejects.toThrow(
        "Solo se pueden confirmar órdenes pendientes",
      );
    });
  });
});
