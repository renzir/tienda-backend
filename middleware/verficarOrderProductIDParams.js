function verificarID(req, res, next) {
  const order_id = parseInt(req.params.orderid, 10);
  const product_id = parseInt(req.params.productid, 10);


  
  if (isNaN(product_id))
    return res
      .status(400)
      .json({ message: "El parámetro ID debe ser un número entero positivo" });

  if (product_id <= 0)
    return res
      .status(400)
      .json({ message: "El parámetro ID debe ser un número entero positivo" });

  if (isNaN(order_id))
    return res
      .status(400)
      .json({ message: "El parámetro ID debe ser un número entero positivo" });

  if (order_id <= 0)
    return res
      .status(400)
      .json({ message: "El parámetro ID debe ser un número entero positivo" });

  req.product_id = product_id;
  req.order_id = order_id;

  next();
}
module.exports = verificarID;
