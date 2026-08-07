const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const validateProductId = require("../../middleware/validateProductId");
const validateProductCreation = require("../../middleware/validateProductCreation");
const validateProductUpdate = require("../../middleware/validateProductUpdate");

/**
 * @openapi
 * /api/products/getProducts:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 */
router.get("/getProducts", productController.getProductsController);

/**
 * @openapi
 * /api/products/getProductById/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get(
  "/getProductById/:id",
  validateProductId,
  productController.getProductByIDController,
);

router.patch(
  "/modifyProduct",
  validateProductUpdate,
  productController.modifyProductController,
);

router.delete(
  "/deleteProduct/:id",
  validateProductId,
  productController.deteleProductController,
);

/**
 * @openapi
 * /api/products/createProduct:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, precio, cantidad_disponible]
 *             properties:
 *               nombre: { type: string }
 *               precio: { type: number }
 *               cantidad_disponible: { type: integer }
 *               categoria: { type: string }
 *               descripcion: { type: string }
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 */
router.post(
  "/createProduct",
  validateProductCreation,
  productController.createProductController,
);

module.exports = router;

