const express = require("express");
const OrderController = require("./order.controller");
const validateOrderCreation = require("../../middleware/validateOrderCreation.js");

const router = express.Router();

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     summary: Obtiene detalles de una orden por ID
 *     tags: [Ordenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Detalles de la orden
 *       404:
 *         description: Orden no encontrada
 */
router.get("/:id", OrderController.getOrderDetails);

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Obtiene todas las órdenes
 *     tags: [Ordenes]
 *     responses:
 *       200:
 *         description: Lista de órdenes
 */
router.get("/", OrderController.getOrders);

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Crea una nueva orden
 *     tags: [Ordenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dato_usuario, direccion]
 *             properties:
 *               dato_usuario: { type: string }
 *               direccion: { type: string }
 *     responses:
 *       201:
 *         description: Orden creada
 */
router.post("/", validateOrderCreation, OrderController.createOrder);

/**
 * @openapi
 * /api/orders/{id}/product/{productId}:
 *   post:
 *     summary: Añade un producto a la orden
 *     tags: [Ordenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cantidad, precio]
 *             properties:
 *               cantidad: { type: integer }
 *               precio: { type: number }
 *     responses:
 *       201:
 *         description: Producto añadido
 */
router.post("/:id/product/:productId", OrderController.addProduct);

/**
 * @openapi
 * /api/orders/{id}/product/{productId}:
 *   delete:
 *     summary: Elimina un producto de la orden
 *     tags: [Ordenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.delete("/:id/product/:productId", OrderController.removeProduct);

/**
 * @openapi
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancela una orden
 *     tags: [Ordenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Orden cancelada
 */
router.patch("/:id/cancel", OrderController.cancelOrder);

/**
 * @openapi
 * /api/orders/{id}/confirm:
 *   patch:
 *     summary: Confirma una orden
 *     tags: [Ordenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Orden confirmada
 */
router.patch("/:id/confirm", OrderController.confirmOrder);

module.exports = router;

