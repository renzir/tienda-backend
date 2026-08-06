const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MiddlewareErrores } = require("./middleware/errorHandler");
const routerProducts = require("./features/products/product.router.js");
const routerOrder = require("./features/orders/order.router.js");
const routerUser = require("./features/users/user.router.js");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://tienda.renzi.dev",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/products", routerProducts);
app.use("/api/orders", routerOrder);
app.use("/api/users", routerUser);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("<h2>Bienvenido a la tienda</h2>");
});

app.use((req, res, next) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  const error = new Error("Ruta no encontrada");
  error.status = 404;
  next(error);
});

app.use(MiddlewareErrores);

module.exports = app;
