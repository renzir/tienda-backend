function verificarCreateOrder(req, res, next) {
  const { usuario_id, direccion } = req.body;

  if (!usuario_id || typeof usuario_id !== "number") {
    return res
      .status(400)
      .json({ message: "Se requiere un ID de usuario numérico válido" });
  }
  if (!direccion || typeof direccion !== "string") {
    return res
      .status(400)
      .json({ message: "La dirección debe ser una cadena de texto válida" });
  }


  next();
}
module.exports = verificarCreateOrder;

