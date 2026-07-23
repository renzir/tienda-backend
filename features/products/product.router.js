const express = require("express");
const router = express.Router();
const productController = require("./product.controller");

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
router.get("/getProductById/:id", productController.getProductByIDController);

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
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 */
router.post("/createProduct", productController.createProductController);

// ... puedes seguir el mismo patrón para los demás métodos (PATCH, DELETE)

module.exports = router;
