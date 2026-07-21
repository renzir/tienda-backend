function verificarCreateProduct(req, res, next) {
  
  const { nombre, precio, cantidad_disponible } = req.body;

  if (typeof cantidad_disponible !== "number" || cantidad_disponible < 0)
    return res.status(400).json({ message: "Cantidad disponible incorrecta" });

  if (typeof precio !== "number" || precio <= 0)
    return res.status(400).json({ message: "Precio incorrecto" });

  if (typeof nombre !== "string")
    return res.status(400).json({ message: "Nombre incorrecto" });
  next();
}
module.exports = verificarCreateProduct;

