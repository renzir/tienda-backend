const request = require("supertest");
const app = require("../app");
const pool = require("../db/database");
const resetAndSeedDatabase = require("./resetdb");

describe("Product Routes", () => {
  beforeEach(async () => {
    await resetAndSeedDatabase();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("GET /api/products/getProducts", () => {
    it("should return all products", async () => {
      const response = await request(app).get("/api/products/getProducts");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return 404 when no products exist", async () => {
      const connection = await pool.getConnection();
      await connection.execute("DELETE FROM productos");
      connection.release();

      const response = await request(app).get("/api/products/getProducts");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "No hay productos");
    });
  });

  describe("GET /api/products/getProductById/:id", () => {
    it("should return a product by ID", async () => {
      const response = await request(app).get("/api/products/getProductById/1");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("id");
    });

    it("should return 404 for non-existent product", async () => {
      const response = await request(app).get(
        "/api/products/getProductById/999",
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Producto no encontrado");
    });

    it("should return 400 for invalid ID format", async () => {
      const response = await request(app).get(
        "/api/products/getProductById/abc",
      );
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    it("should return 400 for zero ID", async () => {
      const response = await request(app).get("/api/products/getProductById/0");
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    it("should return 400 for negative ID", async () => {
      const response = await request(app).get(
        "/api/products/getProductById/-1",
      );
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("PATCH /modifyProduct", () => {
    it("should modify a product", async () => {
      await request(app).post("/api/products/createProduct").send({
        nombre: "Product to Modify",
        precio: 10.0,
        cantidad_disponible: 5,
      });

      const response = await request(app)
        .patch("/api/products/modifyProduct")
        .send({
          id: 1, 
          nombre: "Updated Product",
          precio: 29.99,
        });
      expect(response.status).toBe(200);
    });

    it("should return 404 when product does not exist", async () => {
      const response = await request(app)
        .patch("/api/products/modifyProduct")
        .send({
          id: 999,
          nombre: "Non-existent Product",
          precio: 99.99,
        });
      expect(response.status).toBe(404);
    });

    it("should return 400 for invalid product data - missing id", async () => {
      const response = await request(app)
        .patch("/api/products/modifyProduct")
        .send({
          nombre: "Test Product",
          precio: 99.99,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid product data - missing nombre", async () => {
      const response = await request(app)
        .patch("/api/products/modifyProduct")
        .send({
          id: 1,
          precio: 99.99,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid product data - missing precio", async () => {
      const response = await request(app)
        .patch("/api/products/modifyProduct")
        .send({
          id: 1,
          nombre: "Test Product",
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid product data - precio <= 0", async () => {
      const response = await request(app)
        .patch("/api/products/modifyProduct")
        .send({
          id: 1,
          nombre: "Test Product",
          precio: 0,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid product data - precio negative", async () => {
      const response = await request(app)
        .patch("/api/products/modifyProduct")
        .send({
          id: 1,
          nombre: "Test Product",
          precio: -10,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid product data - nombre not a string", async () => {
      const response = await request(app)
        .patch("/api/products/modifyProduct")
        .send({
          id: 1,
          nombre: 123,
          precio: 99.99,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid product data - id not a number", async () => {
      const response = await request(app)
        .patch("/api/products/modifyProduct")
        .send({
          id: "abc",
          nombre: "Test Product",
          precio: 99.99,
        });
      expect(response.status).toBe(400);
    });
  });

  describe("POST /createProduct", () => {
    it("should create a new product", async () => {
      const response = await request(app)
        .post("/api/products/createProduct")
        .send({
          nombre: "New Product",
          precio: 19.99,
          cantidad_disponible: 10,
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
    });

    it("should return 409 when product already exists", async () => {
      await request(app).post("/api/products/createProduct").send({
        nombre: "Existing Product",
        precio: 19.99,
        cantidad_disponible: 10,
      });

      const response = await request(app)
        .post("/api/products/createProduct")
        .send({
          nombre: "Existing Product",
          precio: 19.99,
          cantidad_disponible: 10,
        });
      expect(response.status).toBe(409);
    });

    it("should return 400 for invalid product creation data - missing nombre", async () => {
      const response = await request(app)
        .post("/api/products/createProduct")
        .send({
          precio: 59.99,
          cantidad_disponible: 10,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid product creation data - missing precio", async () => {
      const response = await request(app)
        .post("/api/products/createProduct")
        .send({
          nombre: "New Product",
          cantidad_disponible: 10,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid product creation data - missing cantidad_disponible", async () => {
      const response = await request(app)
        .post("/api/products/createProduct")
        .send({
          nombre: "New Product",
          precio: 59.99,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid product creation data - precio <= 0", async () => {
      const response = await request(app)
        .post("/api/products/createProduct")
        .send({
          nombre: "New Product",
          precio: 0,
          cantidad_disponible: 10,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid product creation data - precio negative", async () => {
      const response = await request(app)
        .post("/api/products/createProduct")
        .send({
          nombre: "New Product",
          precio: -10,
          cantidad_disponible: 10,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid product creation data - nombre not a string", async () => {
      const response = await request(app)
        .post("/api/products/createProduct")
        .send({
          nombre: 123,
          precio: 59.99,
          cantidad_disponible: 10,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid product creation data - cantidad_disponible not a number", async () => {
      const response = await request(app)
        .post("/api/products/createProduct")
        .send({
          nombre: "New Product",
          precio: 59.99,
          cantidad_disponible: "abc",
        });
      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /deleteProduct/:id", () => {
    it("should delete a product", async () => {
      const response = await request(app).delete(
        "/api/products/deleteProduct/1",
      );
      expect(response.status).toBe(200);
    });

    it("should return 404 when product does not exist", async () => {
      const response = await request(app).delete(
        "/api/products/deleteProduct/999",
      );
      expect(response.status).toBe(404);
    });

    it("should return 400 for invalid ID format in deletion", async () => {
      const response = await request(app).delete(
        "/api/products/deleteProduct/abc",
      );
      expect(response.status).toBe(400);
    });

    it("should return 400 for zero ID in deletion", async () => {
      const response = await request(app).delete(
        "/api/products/deleteProduct/0",
      );
      expect(response.status).toBe(400);
    });

    it("should return 400 for negative ID in deletion", async () => {
      const response = await request(app).delete(
        "/api/products/deleteProduct/-1",
      );
      expect(response.status).toBe(400);
    });
  });
});
