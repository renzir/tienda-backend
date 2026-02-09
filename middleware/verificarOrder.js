function verificarCreateOrder(req, res, next) {
  const { dato_usuario, direccion } = req.body;

  if (!dato_usuario || typeof dato_usuario !== "string") {
    return res
      .status(400)
      .json({ message: "Escriba una cadena de texto válida para el usuario" });
  }
  if (!direccion || typeof direccion !== "string") {
    return res
      .status(400)
      .json({ message: "La dirección debe ser una cadena de texto válida" });
  }

  next();
}
module.exports = verificarCreateOrder;
