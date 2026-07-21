const express = require("express");
const cors = require("cors");
const routerProducts = require("./features/products/product.router.js");
const MiddlewareErrores = require("./middleware/errorHandler.js");
const routerOrder = require("./features/orders/order.router.js");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/products", routerProducts);
app.use("/order", routerOrder);

app.get("/", (req, res) => {
  res.send("<h2>Bienvenido a la tienda</h2>");
});

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  const error = new Error("Ruta no encontrada");
  error.status = 404;
  next(error);
});

app.use(MiddlewareErrores);

module.exports = app;
