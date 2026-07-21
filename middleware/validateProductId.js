function verificarID(req, res, next) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id))
    return res
      .status(400)
      .json({ message: "El parámetro ID debe ser un número entero positivo" });

  if (id <= 0)
    return res
      .status(400)
      .json({ message: "El parámetro ID debe ser un número entero positivo" });

  req.id = id;
  next();
}
module.exports = verificarID;
