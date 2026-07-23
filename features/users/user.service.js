const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("./user.repository");
const { AppError } = require("../../middleware/errorHandler");
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_desarrollo";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

class UserService {
  /**
   * Registra un nuevo usuario:
   * 1. Verifica si ya existe por email
   * 2. Encripta la contraseña
   * 3. Guarda en BD
   */
  static async register({ nombre, email, password }) {
    if (!nombre || !email || !password) {
      throw new AppError("Todos los campos son obligatorios", 400);
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("El email ya está registrado", 409);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userId = await UserRepository.create({
      nombre,
      email,
      password: hashedPassword,
    });

    return { id: userId, nombre, email };
  }

  /**
   * Autentica usuario:
   * 1. Busca por email
   * 2. Compara passwords
   * 3. Genera token
   */
  static async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Credenciales inválidas", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Credenciales inválidas", 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
    };
  }
}

module.exports = UserService;