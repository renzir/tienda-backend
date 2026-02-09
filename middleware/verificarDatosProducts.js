const db = require("../db/database");

async function verificarDatosProducts(req, res, next) {
  const { id, nombre, precio } = req.body;

  if (typeof id !== "number")
    return res.status(400).json({ message: "ID incorrecta" });

  if (typeof precio !== "number" || precio <= 0)
    return res.status(400).json({ message: "Precio incorrecto" });

  if (typeof nombre !== "string")
    return res.status(400).json({ message: "Nombre incorrecto" });

  next();
}
module.exports = verificarDatosProducts;
