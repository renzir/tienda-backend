const request = require('supertest');
const app = require('.app');

describe('Product Router', () => {
  describe('GET /getProducts', () => {
    it('should return all products with status 200', async () => {
      const response = await request(app)
        .get('/getProducts')
        .expect(200);
      
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should return 404 when no products exist', async () => {
      const response = await request(app)
        .get('/getProducts')
        .expect(404);
      
      expect(response.body).toHaveProperty('message', 'No hay productos');
    });
  });

  describe('GET /getProductById/:id', () => {
    it('should return a product by ID with status 200', async () => {
      const response = await request(app)
        .get('/getProductById/1')
        .expect(200);
      
      expect(response.body).toHaveProperty('id');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/getProductById/999')
        .expect(404);
      
      expect(response.body).toHaveProperty('message', 'Producto no encontrado');
    });

    it('should return 400 for invalid ID format', async () => {
      await request(app)
        .get('/getProductById/abc')
        .expect(400);
    });

    it('should return 400 for zero ID', async () => {
      await request(app)
        .get('/getProductById/0')
        .expect(400);
    });

    it('should return 400 for negative ID', async () => {
      await request(app)
        .get('/getProductById/-1')
        .expect(400);
    });
  });

  describe('PATCH /modifyProduct', () => {
    it('should modify a product with valid data and status 200', async () => {
      const response = await request(app)
        .patch('/modifyProduct')
        .send({
          id: 1,
          nombre: 'Updated Product',
          precio: 99.99
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Modificacion existosa');
    });

    it('should return 404 when product does not exist', async () => {
      const response = await request(app)
        .patch('/modifyProduct')
        .send({
          id: 999,
          nombre: 'Non-existent Product',
          precio: 99.99
        })
        .expect(404);
      
      expect(response.body).toHaveProperty('message', 'Producto no existe');
    });

    it('should return 400 for invalid product data - missing id', async () => {
      await request(app)
        .patch('/modifyProduct')
        .send({
          nombre: 'Test Product',
          precio: 99.99
        })
        .expect(400);
    });

    it('should return 400 for invalid product data - missing nombre', async () => {
      await request(app)
        .patch('/modifyProduct')
        .send({
          id: 1,
          precio: 99.99
        })
        .expect(400);
    });

    it('should return 400 for invalid product data - missing precio', async () => {
      await request(app)
        .patch('/modifyProduct')
        .send({
          id: 1,
          nombre: 'Test Product'
        })
        .expect(400);
    });

    it('should return 400 for invalid product data - precio <= 0', async () => {
      await request(app)
        .patch('/modifyProduct')
        .send({
          id: 1,
          nombre: 'Test Product',
          precio: 0
        })
        .expect(400);
    });

    it('should return 400 for invalid product data - precio negative', async () => {
      await request(app)
        .patch('/modifyProduct')
        .send({
          id: 1,
          nombre: 'Test Product',
          precio: -10
        })
        .expect(400);
    });

    it('should return 400 for invalid product data - nombre not a string', async () => {
      await request(app)
        .patch('/modifyProduct')
        .send({
          id: 1,
          nombre: 123,
          precio: 99.99
        })
        .expect(400);
    });

    it('should return 400 for invalid product data - id not a number', async () => {
      await request(app)
        .patch('/modifyProduct')
        .send({
          id: 'abc',
          nombre: 'Test Product',
          precio: 99.99
        })
        .expect(400);
    });
  });

  describe('POST /createProduct', () => {
    it('should create a new product with valid data and status 200', async () => {
      const response = await request(app)
        .post('/createProduct')
        .send({
          nombre: 'New Product',
          precio: 59.99,
          cantidad_disponible: 10
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Producto creado');
    });

    it('should return 400 for invalid product creation data - missing nombre', async () => {
      await request(app)
        .post('/createProduct')
        .send({
          precio: 59.99,
          cantidad_disponible: 10
        })
        .expect(400);
    });

    it('should return 400 for invalid product creation data - missing precio', async () => {
      await request(app)
        .post('/createProduct')
        .send({
          nombre: 'New Product',
          cantidad_disponible: 10
        })
        .expect(400);
    });

    it('should return 400 for invalid product creation data - missing cantidad_disponible', async () => {
      await request(app)
        .post('/createProduct')
        .send({
          nombre: 'New Product',
          precio: 59.99
        })
        .expect(400);
    });

    it('should return 400 for invalid product creation data - precio <= 0', async () => {
      await request(app)
        .post('/createProduct')
        .send({
          nombre: 'New Product',
          precio: 0,
          cantidad_disponible: 10
        })
        .expect(400);
    });

    it('should return 400 for invalid product creation data - precio negative', async () => {
      await request(app)
        .post('/createProduct')
        .send({
          nombre: 'New Product',
          precio: -10,
          cantidad_disponible: 10
        })
        .expect(400);
    });

    it('should return 400 for invalid product creation data - nombre not a string', async () => {
      await request(app)
        .post('/createProduct')
        .send({
          nombre: 123,
          precio: 59.99,
          cantidad_disponible: 10
        })
        .expect(400);
    });

    it('should return 400 for invalid product creation data - cantidad_disponible not a number', async () => {
      await request(app)
        .post('/createProduct')
        .send({
          nombre: 'New Product',
          precio: 59.99,
          cantidad_disponible: 'abc'
        })
        .expect(400);
    });

    it('should return 409 when product already exists', async () => {
      const response = await request(app)
        .post('/createProduct')
        .send({
          nombre: 'Producto ya existente en BD',
          precio: 59.99,
          cantidad_disponible: 10
        })
        .expect(409);
      
      expect(response.body).toHaveProperty('message', 'Producto ya existente');
    });
  });

  describe('DELETE /deleteProduct/:id', () => {
    it('should delete a product by ID with status 200', async () => {
      const response = await request(app)
        .delete('/deleteProduct/1')
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Producto eliminado');
    });

    it('should return 404 when product does not exist', async () => {
      const response = await request(app)
        .delete('/deleteProduct/999')
        .expect(404);
      
      expect(response.body).toHaveProperty('message', 'Fallo en eliminar producto');
    });

    it('should return 400 for invalid ID format in deletion', async () => {
      await request(app)
        .delete('/deleteProduct/abc')
        .expect(400);
    });

    it('should return 400 for zero ID in deletion', async () => {
      await request(app)
        .delete('/deleteProduct/0')
        .expect(400);
    });

    it('should return 400 for negative ID in deletion', async () => {
      await request(app)
        .delete('/deleteProduct/-1')
        .expect(400);
    });
  });
});