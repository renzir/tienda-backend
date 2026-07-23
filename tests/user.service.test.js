// tests/user.service.test.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserService = require("./../features/users/user.service");
const UserRepository = require("./../features/users/user.repository");
const { AppError } = require("./../middleware/errorHandler");

jest.mock("../features/users/user.repository");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Unit: UserService (Logic Layer)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        nombre: "Juan Pérez",
        email: "juan@example.com",
        password: "contraseña123",
      };

      UserRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed_password_mock");
      UserRepository.create.mockResolvedValue(5);

      const result = await UserService.register(userData);

      expect(UserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(UserRepository.create).toHaveBeenCalledWith({
        nombre: userData.nombre,
        email: userData.email,
        password: "hashed_password_mock",
      });
      expect(result).toEqual({
        id: 5,
        nombre: userData.nombre,
        email: userData.email,
      });
    });

    it("should throw 400 when missing fields", async () => {
      await expect(
        UserService.register({ nombre: "Juan", email: "juan@example.com" }),
      ).rejects.toThrow("Todos los campos son obligatorios");

      await expect(
        UserService.register({ nombre: "Juan", password: "123" }),
      ).rejects.toThrow("Todos los campos son obligatorios");

      await expect(
        UserService.register({ email: "juan@example.com", password: "123" }),
      ).rejects.toThrow("Todos los campos son obligatorios");
    });

    it("should throw 409 when email is already registered", async () => {
      const userData = {
        nombre: "Juan Pérez",
        email: "juan@example.com",
        password: "contraseña123",
      };

      const existingUser = {
        id: 1,
        nombre: "Usuario Existente",
        email: "juan@example.com",
      };
      UserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(UserService.register(userData)).rejects.toThrow(
        "El email ya está registrado",
      );
      expect(UserRepository.create).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login successfully and return token", async () => {
      const email = "juan@example.com";
      const password = "contraseña123";
      const mockUser = {
        id: 1,
        nombre: "Juan Pérez",
        email: email,
        password: "hashed_password_mock",
      };

      UserRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mock_jwt_token");

      const result = await UserService.login(email, password);

      expect(UserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email },
        expect.any(String),
        expect.objectContaining({ expiresIn: expect.any(String) }),
      );
      expect(result).toEqual({
        token: "mock_jwt_token",
        user: {
          id: mockUser.id,
          nombre: mockUser.nombre,
          email: mockUser.email,
        },
      });
    });

    it("should throw 401 when user not found", async () => {
      UserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        UserService.login("noexiste@example.com", "password"),
      ).rejects.toThrow("Credenciales inválidas");
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it("should throw 401 when password is incorrect", async () => {
      const mockUser = {
        id: 1,
        nombre: "Juan Pérez",
        email: "juan@example.com",
        password: "hashed_password_mock",
      };
      UserRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        UserService.login("juan@example.com", "wrong_password"),
      ).rejects.toThrow("Credenciales inválidas");
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});
