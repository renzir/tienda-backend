const {
  getProductsController,
  getProductByIDController,
  modifyProductController,
  createProductController,
  deteleProductController,
} = require("./../features/products/product.controller");

// Mock the services module
jest.mock("./product.services", () => ({
  getProducts: jest.fn(),
  getProductByID: jest.fn(),
  modifyProductByIDServices: jest.fn(),
  createProductServices: jest.fn(),
  getProductNameServices: jest.fn(),
  deleteProductServices: jest.fn(),
}));

const {
  getProducts,
  getProductByID,
  modifyProductByIDServices,
  createProductServices,
  getProductNameServices,
  deleteProductServices,
} = require("./product.services");
describe("Product Controller Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProductsController", () => {
    it("should return products when they exist", async () => {
      const mockProducts = [{ id: 1, nombre: "Test Product" }];
      getProducts.mockResolvedValue(mockProducts);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await getProductsController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProducts,
      });
    });

    it("should return 404 when no products exist", async () => {
      getProducts.mockResolvedValue(null);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await getProductsController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "No hay productos",
      });
    });
  });

  describe("getProductByIDController", () => {
    it("should return product when found", async () => {
      const mockProduct = { id: 1, name: "Test Product" };
      getProductByID.mockResolvedValue(mockProduct);

      const req = { id: 1 };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await getProductByIDController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
      });
    });

    it("should return 404 when product not found", async () => {
      getProductByID.mockResolvedValue(null);

      const req = { id: 1 };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await getProductByIDController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Producto no encontrado",
      });
    });
  });

  // Test modifyProductController
  describe("modifyProductController", () => {
    it("should modify product successfully", async () => {
      getProductByID.mockResolvedValue({ id: 1, name: "Test Product" });
      modifyProductByIDServices.mockResolvedValue(true);

      const req = {
        body: {
          id: 1,
          nombre: "Updated Product",
          precio: 29.99,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await modifyProductController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Modificacion existosa",
      });
    });

    it("should return 404 when product does not exist", async () => {
      getProductByID.mockResolvedValue(null);

      const req = {
        body: {
          id: 1,
          nombre: "Updated Product",
          precio: 29.99,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await modifyProductController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Producto no existe",
      });
    });
  });

  // Test createProductController
  describe("createProductController", () => {
    it("should create product successfully", async () => {
      getProductNameServices.mockResolvedValue(null);
      createProductServices.mockResolvedValue(true);
      const req = {
        body: {
          nombre: "New Product",
          precio: 19.99,
          cantidad_disponible: 10,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await createProductController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Producto creado",
      });
    });

    it("should return 409 when product already exists", async () => {
      getProductNameServices.mockResolvedValue({
        id: 1,
        name: "Existing Product",
      });

      const req = {
        body: {
          nombre: "Existing Product",
          precio: 19.99,
          cantidad_disponible: 10,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await createProductController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Producto ya existente",
      });
    });
  });

  // Test deteleProductController
  describe("deteleProductController", () => {
    it("should delete product successfully", async () => {
      deleteProductServices.mockResolvedValue(true);

      const req = { id: 1 };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await deteleProductController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        succes: true,
        message: "Producto eliminado",
      });
    });
  });
});
