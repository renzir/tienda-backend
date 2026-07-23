const express = require("express");
const UserController = require("./user.controller");

const router = express.Router();

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre: { type: string, example: "Juan Perez" }
 *               email: { type: string, example: "juan@example.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Faltan campos obligatorios
 *       409:
 *         description: El email ya está registrado
 */
router.post("/register", UserController.register);

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Inicia sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "juan@example.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", UserController.login);

module.exports = router;
