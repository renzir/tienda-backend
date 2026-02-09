const getOrderByID = require("./order.getByID.service");
const orderModifyService = require("./order.modify.service");

async function modifyProductController(req, res) {
  const { dato_usuario, fecha, id } = req.body;

  const product = await getOrderByID(id);

  if (!product) throw new AppError("Orden no existe", 404);

  const result = await orderModifyService(dato_usuario, fecha, id);

  if (result) {
    return res.status(200).json({
      success: true,
      message: "Modificacion existosa",
    });
  }
  if (!result) {
    return res
      .status(204)
      .json({ success: false, message: "Modificacion incorrrecta" });
  }
}
module.exports = modifyProductController;
