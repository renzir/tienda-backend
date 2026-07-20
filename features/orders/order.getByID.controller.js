const getOrderByIdService = require("./order.getByID.service");

async function ordersGetController(req, res, next) {
  try {
    const id = req.id;

  const result = await getOrderByIdService(id);

  if (result) return res.status(200).json({ success: true, data: result });

    return res
      .status(404)
      .json({ success: false, message: "Fallo en encontrar orden" });
  } catch (error) {
    next(error);
  }
}
module.exports = ordersGetController;
