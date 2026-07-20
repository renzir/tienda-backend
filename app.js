const express = require("express");
const cors = require("cors");
const routerProducts = require("./features/products/product.router.js");
const MiddlewareErrores = require("./middleware/MiddlewareErrores.js");
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
app.use('/', (req, res) => {
  res.send('<h2>Bienvenido a la tienda</h2>');
});

app.use((req, res, next) => {
  next(); 
});

app.use(MiddlewareErrores);

module.exports = app;