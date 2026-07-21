const db = require("../db/database");

async function verificarDatosProducts(req, res, next) {
  const { id, nombre, precio } = req.body;

  if (id === undefined || id === null)
    return res.status(400).json({ message: "ID es requerida" });

  if (typeof id !== "number")
    return res.status(400).json({ message: "ID incorrecta" });

  if (precio === undefined || precio === null)
    return res.status(400).json({ message: "Precio es requerido" });

  if (typeof precio !== "number" || precio <= 0)
    return res.status(400).json({ message: "Precio incorrecto" });

  if (nombre === undefined || nombre === null)
    return res.status(400).json({ message: "Nombre es requerido" });

  if (typeof nombre !== "string")
    return res.status(400).json({ message: "Nombre incorrecto" });

  next();
}
module.exports = verificarDatosProducts;

