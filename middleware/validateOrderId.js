function verificarID(req, res, next) {
  const order_id = parseInt(req.params.orderId, 10);

  if (isNaN(order_id))
    return res
      .status(400)
      .json({ message: "El parámetro ID debe ser un número entero positivo" });

  if (order_id <= 0)
    return res
      .status(400)
      .json({ message: "El parámetro ID debe ser un número entero positivo" });

  req.order_id = order_id;
  next();
}
module.exports = verificarID;
