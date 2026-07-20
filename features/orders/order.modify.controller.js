const getOrderByID = require("./order.getByID.service");
const modifyOrderService = require("./order.modify.service");

async function modifyProductController(req, res, next) {
  try {
    const { dato_usuario, direccion, id } = req.body;

  const product = await getOrderByID(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Orden no existe" });
    }

  const result = await modifyOrderService(dato_usuario, direccion, id);

    if (result) {
      return res.status(200).json({
        success: true,
        message: "Modificacion existosa",
      });
    }
    
    return res
      .status(204)
      .json({ success: false, message: "Modificacion incorrrecta" });
  } catch (error) {
    next(error);
  }
}
module.exports = modifyProductController;
