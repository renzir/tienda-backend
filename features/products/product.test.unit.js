const getProductsController = require('./product.get.controller');
const getProductByIDController = require('./product.getByID.controller');
const modifyProductController = require('./product.modify.controller');
const createProductController = require('./product.create.controller');
const deteleProductController = require('./product.detele.controller');

// Mock services
const mockGetProducts = jest.fn();
const mockGetProductByID = jest.fn();
const mockModifyProductByID = jest.fn();
const mockCreateProductServices = jest.fn();
const mockDeteleProductSerices = jest.fn();

// Mock the services
jest.mock('./product.get.service', () => mockGetProducts);
jest.mock('./product.getByID.service', () => mockGetProductByID);
jest.mock('./product.modify.service', () => mockModifyProductByID);
jest.mock('./product.create.services', () => mockCreateProductServices);
jest.mock('./product.detele.service', () => mockDeteleProductSerices);


describe('Product Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test getProductsController
  describe('getProductsController', () => {
    it('should return products when they exist', async () => {
      const mockProducts = [{ id: 1, name: 'Test Product' }];
      mockGetProducts.mockResolvedValue(mockProducts);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await getProductsController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProducts
      });
    });

    it('should return 404 when no products exist', async () => {
      mockGetProducts.mockResolvedValue(null);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await getProductsController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No hay productos'
      });
    });
  });

  // Test getProductByIDController
  describe('getProductByIDController', () => {
    it('should return product when found', async () => {
      const mockProduct = { id: 1, name: 'Test Product' };
      mockGetProductByID.mockResolvedValue(mockProduct);

      const req = { id: 1 };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await getProductByIDController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProduct
      });
    });

    it('should return 404 when product not found', async () => {
      mockGetProductByID.mockResolvedValue(null);

      const req = { id: 1 };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await getProductByIDController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Producto no encontrado'
      });
    });
  });

  // Test modifyProductController
  describe('modifyProductController', () => {
    it('should modify product successfully', async () => {
      mockGetProductByID.mockResolvedValue({ id: 1, name: 'Test Product' });
      mockModifyProductByID.mockResolvedValue(true);

      const req = {
        body: {
          id: 1,
          nombre: 'Updated Product',
          precio: 29.99
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await modifyProductController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Modificacion existosa'
      });
    });

    it('should return 404 when product does not exist', async () => {
      mockGetProductByID.mockResolvedValue(null);

      const req = {
        body: {
          id: 1,
          nombre: 'Updated Product',
          precio: 29.99
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await modifyProductController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Producto no existe'
      });
    });
  });

  // Test createProductController
  describe('createProductController', () => {
    it('should create product successfully', async () => {
      // Mock the service that checks if product exists
      const mockGetProductNameServices = jest.fn();
      jest.mock('./product.getByName.service', () => mockGetProductNameServices);
      
      mockGetProductNameServices.mockResolvedValue(null);
      mockCreateProductServices.mockResolvedValue(true);

      const req = {
        body: {
          nombre: 'New Product',
          precio: 19.99,
          cantidad_disponible: 10
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await createProductController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Producto creado'
      });
    });

    it('should return 409 when product already exists', async () => {
      // Mock the service that checks if product exists
      const mockGetProductNameServices = jest.fn();
      jest.mock('./product.getByName.service', () => mockGetProductNameServices);
      
      mockGetProductNameServices.mockResolvedValue({ id: 1, name: 'Existing Product' });

      const req = {
        body: {
          nombre: 'Existing Product',
          precio: 19.99,
          cantidad_disponible: 10
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await createProductController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Producto ya existente'
      });
    });
  });

  // Test deteleProductController
  describe('deteleProductController', () => {
    it('should delete product successfully', async () => {
      mockDeteleProductSerices.mockResolvedValue(true);

      const req = { id: 1 };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await deteleProductController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        succes: true,
        message: 'Producto eliminado'
      });
    });
  });
});