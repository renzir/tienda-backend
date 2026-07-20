const deleteOrderService = require("./order.detele.service");

async function deteleOrderController(req, res, next) {
  try {
    const id = req.id;

  const result = await deleteOrderService(id);

    if (result)
      return res.status(200).json({ succes: true, message: "Orden eliminada" });

    return res
      .status(404)
      .json({ success: false, message: "Fallo en eliminar orden" });
  } catch (error) {
    next(error);
  }
}
module.exports = deteleOrderController;
