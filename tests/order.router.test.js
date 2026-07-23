const request = require("supertest");
const app = require("../app");
const pool = require("../db/database");
const resetAndSeedDatabase = require("./resetdb");

describe("order Integration Tests", () => {
  let createdOrderId; // Variable para almacenar el ID de la orden creada

  beforeEach(async () => {
    await resetAndSeedDatabase();
    console.log("Base de datos lista para pruebas integration");

    // Crear una orden de prueba para los tests
    const newOrderResponse = await request(app)
      .post("/api/orders")
      .send({ usuario_id: 1, direccion: "Test Address" });

    if (newOrderResponse.statusCode === 201 && newOrderResponse.body.success) {
      createdOrderId = newOrderResponse.body.data.orderId;
    } else {
      console.error(
        "Error al crear la orden de prueba:",
        newOrderResponse.body,
      );
      throw new Error("No se pudo crear la orden de prueba.");
    }
  });

  afterAll(async () => {
    await pool.end();
    console.log("Conexión a base de datos cerrada");
  });

  // Test cases for order creation
  describe("POST /api/orders", () => {
    it("should create a new order", async () => {
      const newOrderForTest = {
        usuario_id: 1,
        direccion: "Nueva Dirección",
      };
      const responseCreate = await request(app)
        .post("/api/orders")
        .send(newOrderForTest);

      expect(responseCreate.statusCode).toBe(201);
      expect(responseCreate.body.success).toBe(true);
      expect(responseCreate.body.data).toHaveProperty("orderId");
    });

    it("should return 400 for invalid order data", async () => {
      const invalidOrder = {
        usuario_id: "invalid", // Enviando un dato inválido
      };

      const response = await request(app)
        .post("/api/orders")
        .send(invalidOrder);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message"); // Verificamos si devuelve mensaje
    });
  });

  // Test cases for getting all orders
  describe("GET /api/orders", () => {
    it("should return all orders", async () => {
      const response = await request(app).get("/api/orders");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0); // Ahora debe haber al menos la orden creada en beforeEach
    });
  });

  // Test cases for getting an order by ID
  describe("GET /api/orders/:id", () => {
    it("should return an order by ID", async () => {
      const response = await request(app).get(`/api/orders/${createdOrderId}`); // Usar el ID dinámico

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id", createdOrderId);
    });

    it("should return 404 for a non-existent order ID", async () => {
      const response = await request(app).get("/api/orders/99999"); // Usar un ID muy alto para asegurar que no existe

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // Test cases for adding a product to an order
  describe("POST /api/orders/:id/product/:productId", () => {
    it("should add a product to an order", async () => {
      // Necesitamos un producto existente. resetAndSeedDatabase ya inserta algunos.
      // Usaremos productId: 1 o 2.
      const response = await request(app)
        .post(`/api/orders/${createdOrderId}/product/1`) // Usar el ID de orden dinámico
        .send({ cantidad: 1, precio: 10.99 }); // Enviar cantidad y precio

      expect(response.statusCode).toBe(201); // Debería ser 201 si es nueva adición
      expect(response.body.success).toBe(true);
    });

    it("should return 404 if order or product does not exist", async () => {
      const response = await request(app)
        .post(`/api/orders/${createdOrderId}/product/99999`) // Producto no existente
        .send({ cantidad: 1, precio: 10.99 });

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // Test cases for removing a product from an order
  describe("DELETE /api/orders/:id/product/:productId", () => {
    // Primero, añadimos un producto para poder eliminarlo
    beforeEach(async () => {
      await request(app)
        .post(`/api/orders/${createdOrderId}/product/2`)
        .send({ cantidad: 1, precio: 20.5 });
    });

    it("should remove a product from an order", async () => {
      const response = await request(app).delete(
        `/api/orders/${createdOrderId}/product/2`,
      ); // Usar el ID de orden dinámico y producto 2

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 404 if order or product does not exist", async () => {
      const response = await request(app).delete(
        `/api/orders/${createdOrderId}/product/99999`,
      ); // Producto no existente

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // Test cases for canceling an order
  describe("PATCH /api/orders/:id/cancel", () => {
    it("should cancel a pending order", async () => {
      const response = await request(app).patch(
        `/api/orders/${createdOrderId}/cancel`,
      ); // Usar el ID de orden dinámico

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 404 for non-existent order", async () => {
      const response = await request(app).patch("/api/orders/99999/cancel");

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // Test cases for confirming an order
  describe("PATCH /api/orders/:id/confirm", () => {
    let orderToConfirmId;

    beforeEach(async () => {
      // Creamos una nueva orden para confirmar en cada test de confirmación
      const resOrder = await request(app)
        .post("/api/orders")
        .send({ usuario_id: 1, direccion: "Confirm Address" });
      orderToConfirmId = resOrder.body.data.orderId;

      // Añadir un producto a esta orden para que haya algo que confirmar
      await request(app)
        .post(`/api/orders/${orderToConfirmId}/product/1`)
        .send({ cantidad: 1, precio: 10.99 });
    });

    it("should confirm an order", async () => {
      const response = await request(app).patch(
        `/api/orders/${orderToConfirmId}/confirm`,
      ); // Usar el ID de orden dinámico

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 404 if order does not exist", async () => {
      const response = await request(app).patch("/api/orders/99999/confirm");

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
