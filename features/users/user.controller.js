const UserService = require("./user.service");
const AppError = require("../../middleware/errorHandler").AppError;

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

      return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;