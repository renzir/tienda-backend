const express = require("express");
const cors = require("cors"); // <-- agregá esto
const routerProducts = require("./features/products/product.router.js");
const MiddlewareErrores = require("./middleware/MiddlewareErrores.js");
const routerOrder = require("./features/orders/order.router.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//app.use(
//  cors({
//    origin: "https://tienda.renzi.dev",
//    methods: ["GET", "POST", "PUT", "DELETE"],
//    credentials: true,
//  }),
//);
// Configuración de CORS para el entorno de desarrollo

app.use(
  cors({
    origin: "*", // Acepta cualquier origen
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use("/products", routerProducts);
app.use("/order", routerOrder);
app.use('/', (req, res) => {
  res.send('<h2>Hola, ¿cómo estás?</h2>');
})

app.use((req, res, next) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  // Si llegás aquí, significa que Express NO encontró ninguna ruta coincidente.
  // Pero tu middleware de errores también puede capturar esto si lo configuras para errores de sistema.
  next(); 
});

app.use(MiddlewareErrores);

app.listen(PORT, () => {
  console.log(`Servidor activo: http://localhost:${PORT}`);
});
