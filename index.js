const express = require("express");
const cors = require("cors"); // <-- agregá esto
const routerProducts = require("./features/products/product.router.js");
const MiddlewareErrores = require("./middleware/MiddlewareErrores.js");
const routerOrder = require("./features/orders/order.router.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: "https://tienda-frontend-portafolio.netlify.app", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true 
}));


app.use(express.json());

app.use("/products", routerProducts);
app.use("/order", routerOrder);

app.use(MiddlewareErrores);

app.listen(PORT, () => {
  console.log(`Servidor activo: http://localhost:${PORT}`);
});
