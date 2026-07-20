const orderCreateService = require("./order.create.service.js");

async function orderCreateController(req, res, next) {
  try {
    const { dato_usuario, direccion } = req.body;

  const result = await orderCreateService(dato_usuario, direccion);

    if (result.success)
      return res.status(200).json({ success: true, orderId: result.orderId, message: "Creado con exito" });

    return res
      .status(404)
      .json({ success: false, message: "Fallo en crear orden" });
  } catch (error) {
    next(error);
  }
}
module.exports = orderCreateController;
