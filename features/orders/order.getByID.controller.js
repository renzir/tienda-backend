const ordersGetByIDService = require("./order.getByID.service");

async function ordersGetController(req, res) {
  const id = req.id;

  const result = await ordersGetByIDService(id);

  if (result) return res.status(200).json({ success: true, data: result });

  if (!result)
    return res
      .status(404)
      .json({ success: false, message: "Fallo en encontrar orden" });
}
module.exports = ordersGetController;
