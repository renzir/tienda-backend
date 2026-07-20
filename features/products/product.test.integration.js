const request = require('supertest');
const app = require('../../app');
const { connectDB, disconnectDB } = require('../../config/database');

describe('Product Integration Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  // Test GET /getProducts
  describe('GET /getProducts', () => {
    it('should return all products from database', async () => {
      const response = await request(app).get('/getProducts');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  // Test GET /getProductById/:id
  describe('GET /getProductById/:id', () => {
    it('should return a product by ID from database', async () => {
      const response = await request(app).get('/getProductById/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });
  });

  // Test POST /createProduct
  describe('POST /createProduct', () => {
    it('should create a new product in database', async () => {
      const newProduct = {
        name: 'Integration Test Product',
        price: 39.99,
        description: 'Test product for integration test'
      };

      const response = await request(app)
        .post('/createProduct')
        .send(newProduct);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });

  // Test PATCH /modifyProduct
  describe('PATCH /modifyProduct', () => {
    it('should modify a product in database', async () => {
      const updateData = {
        id: 1,
        name: 'Updated Integration Product',
        price: 49.99
      };

      const response = await request(app)
        .patch('/modifyProduct')
        .send(updateData);
      
      expect(response.status).toBe(200);
    });
  });

  // Test DELETE /deleteProduct/:id
  describe('DELETE /deleteProduct/:id', () => {
    it('should delete a product from database', async () => {
      const response = await request(app).delete('/deleteProduct/1');
      expect(response.status).toBe(200);
    });
  });
});