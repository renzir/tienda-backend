const ordersGetService = require("./order.get.service.js");

async function ordersGetController(req, res) {
  const result = await ordersGetService();

  if (result) return res.status(200).json({ success: true, data: result });

  if (!result)
    return res.status(404).json({ success: false, message: "No hay ordenes" });
}
module.exports = ordersGetController;
