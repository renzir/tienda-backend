const deteleOrderSerices = require("./order.detele.service");

async function deteleOrderController(req, res) {
  const id = req.id;

  const result = await deteleOrderSerices(id);

  if (result)
    return res.status(200).json({ succes: true, message: "Orden eliminada" });

  if (!result)
    return res
      .status(404)
      .json({ success: false, message: "Fallo en eliminar orden" });
}
module.exports = deteleOrderController;
