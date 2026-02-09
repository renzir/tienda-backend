const orderCreateService = require("./order.create.service.js");

async function orderCreateController(req, res) {
  const { dato_usuario, direccion } = req.body;

  const result = await orderCreateService(dato_usuario, direccion);

  if (result.success)
    return res.status(200).json({ success: true, orderId: result.orderId, message: "Creado con exito" });

  if (!result.success)
    return res
      .status(404)
      .json({ success: true, message: "Fallo en crear orden" });
}
module.exports = orderCreateController;
