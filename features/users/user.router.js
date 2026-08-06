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

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Obtiene los datos del usuario actual validando la cookie JWT
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     nombre:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: No autorizado (token inválido o expirado)
 */
router.get("/me", UserController.me);

/**
 * @openapi
 * /users/logout:
 *   post:
 *     summary: Cierra la sesión del usuario borrando la cookie de sesión
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */
router.post("/logout", UserController.logout);

module.exports = router;

