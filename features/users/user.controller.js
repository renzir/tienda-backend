const UserService = require("./user.service");
const UserRepository = require("./user.repository");
const AppError = require("../../middleware/errorHandler").AppError;
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_desarrollo";

class UserController {
  /**
   * POST /users/register
   */
  static async register(req, res, next) {
    try {
      const { nombre, email, password } = req.body;

      if (!nombre || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Faltan campos obligatorios",
        });
      }

      const result = await UserService.register({ nombre, email, password });

      return res.status(201).json({
        success: true,
        message: "Usuario registrado correctamente",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /users/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email y contraseña son obligatorios",
        });
      }

      const result = await UserService.login(email, password);

      res.cookie("auth_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000, 
      });

      return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auth/me - Verificar token y obtener datos del usuario
   */
  static async me(req, res, next) {
    try {
      const token = req.cookies?.auth_token;

      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "No autorizado" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await UserRepository.findById(decoded.id);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Usuario no encontrado" });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
        },
      });
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Token inválido o expirado" });
    }
  }

  /**
   * POST /auth/logout - Borrar la cookie de sesión
   */
  static async logout(req, res, next) {
    try {
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      };

      res.clearCookie("auth_token", options);

      return res.status(200).json({
        success: true,
        message: "Sesión cerrada correctamente",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
