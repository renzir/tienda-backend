// tests/user.router.test.js
const request = require("supertest");
const app = require("../app");
const pool = require("../db/database");
const resetAndSeedDatabase = require("./resetdb");

describe("User Integration Tests", () => {
  // Limpiar tabla de usuarios antes de cada prueba
  beforeEach(async () => {
    await resetAndSeedDatabase();
    // Eliminar usuarios creados en pruebas anteriores para mantener consistencia
    const [result] = await pool.execute("DELETE FROM usuarios");
    console.log("Base de datos lista para pruebas de usuarios");
  });

  afterAll(async () => {
    await pool.end();
    console.log("Conexión a base de datos cerrada");
  });

  describe("POST /users/register", () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        nombre: "Carlos García",
        email: "carlos@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/users/register")
        .send(newUser);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Usuario registrado correctamente");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.nombre).toBe(newUser.nombre);
      expect(response.body.data.email).toBe(newUser.email);
    });

    it("should return 400 when missing fields", async () => {
      const incompleteUser = {
        nombre: "Ana López",
        email: "ana@example.com",
        // Falta password
      };

      const response = await request(app)
        .post("/users/register")
        .send(incompleteUser);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Faltan campos obligatorios");
    });

    it("should return 409 when email is already registered", async () => {
      const user1 = {
        nombre: "Luis Martínez",
        email: "luis@example.com",
        password: "password123",
      };

      // Registrar primer usuario
      await request(app).post("/users/register").send(user1);

      // Intentar registrar con el mismo email
      const duplicateUser = {
        nombre: "Luis Martínez 2",
        email: "luis@example.com",
        password: "differentpassword",
      };

      const response = await request(app)
        .post("/users/register")
        .send(duplicateUser);

      expect(response.statusCode).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("El email ya está registrado");
    });
  });

  describe("POST /users/login", () => {
    it("should login successfully with valid credentials", async () => {
      // Primero registrar un usuario
      const newUser = {
        nombre: "María Rodríguez",
        email: "maria@example.com",
        password: "securePassword123",
      };

      await request(app).post("/users/register").send(newUser);

      // Ahora intentar loguearse
      const loginResponse = await request(app)
        .post("/users/login")
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      expect(loginResponse.statusCode).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.message).toBe("Inicio de sesión exitoso");
      expect(loginResponse.body.data).toHaveProperty("token");
      expect(loginResponse.body.data.user).toHaveProperty("id");
      expect(loginResponse.body.data.user.email).toBe(newUser.email);
    });

    it("should return 400 when missing fields", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: "test@example.com",
          // Falta password
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Email y contraseña son obligatorios");
    });

    it("should return 401 when user not found", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: "noexiste@example.com",
          password: "password123",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Credenciales inválidas");
    });

    it("should return 401 when password is incorrect", async () => {
      // Primero registrar un usuario
      const newUser = {
        nombre: "Pedro Sánchez",
        email: "pedro@example.com",
        password: "correctPassword",
      };

      await request(app).post("/users/register").send(newUser);

      // Intentar loguearse con contraseña incorrecta
      const response = await request(app)
        .post("/users/login")
        .send({
          email: newUser.email,
          password: "wrongPassword",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Credenciales inválidas");
    });
  });
});
