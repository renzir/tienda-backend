function verificarCreateProduct(req, res, next) {
  
  const { nombre, precio, cantidad_disponible, categoria, descripcion } = req.body;

  if (typeof cantidad_disponible !== "number" || cantidad_disponible < 0)
    return res.status(400).json({ message: "Cantidad disponible incorrecta" });

  if (typeof precio !== "number" || precio <= 0)
    return res.status(400).json({ message: "Precio incorrecto" });

  if (typeof nombre !== "string")
    return res.status(400).json({ message: "Nombre incorrecto" });

  if (categoria !== undefined && categoria !== null && (typeof categoria !== "string" || categoria.length > 100))
    return res.status(400).json({ message: "Categoría incorrecta (debe ser texto de hasta 100 caracteres)" });

  if (descripcion !== undefined && descripcion !== null && typeof descripcion !== "string")
    return res.status(400).json({ message: "Descripción incorrecta" });

  next();
}
module.exports = verificarCreateProduct;

