const request = require("supertest");
const app = require("../app");
const pool = require("../db/database");

describe("Product Integration Tests", () => {
  beforeAll(async () => {
    console.log("Base de datos lista para pruebas integration");
  });

  afterAll(async () => {
    await pool.end();
    console.log("Conexión a base de datos cerrada");
  });

  describe("GET /products/getProducts", () => {
    it("should return all products from database", async () => {
      const response = await request(app).get("/products/getProducts");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("GET /products/getProductById/:id", () => {
    it("should return a product by ID from database", async () => {
      const response = await request(app).get("/products/getProductById/1");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("id");
    });

    it("should return 404 when product not found", async () => {
      const response = await request(app).get("/products/getProductById/999");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("POST /products/createProduct", () => {
    it("should create a new product in database", async () => {
      const response = await request(app).post("/products/createProduct").send({
        nombre: "Integration Test Product",
        precio: 39.99,
        cantidad_disponible: 10,
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
    });
  });

  describe("PATCH /products/modifyProduct", () => {
    it("should modify a product in database", async () => {
      const response = await request(app)
        .patch("/products/modifyProduct")
        .send({
          id: 1,
          nombre: "Updated Integration Product",
          precio: 49.99,
        });

      expect(response.status).toBe(200);
    });
  });

  describe("DELETE /products/deleteProduct/:id", () => {
    it("should delete a product from database", async () => {
      const response = await request(app).delete("/products/deleteProduct/1");
      expect(response.status).toBe(200);
    });
  });
});
