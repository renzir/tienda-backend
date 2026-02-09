const deteleProductSerices = require("./product.detele.service");

async function deteleProductController(req, res) {
  const id = req.id;

  console.log(id);

  const result = await deteleProductSerices(id);

  if (result)
    return res
      .status(200)
      .json({ succes: true, message: "Producto eliminado" });

  if (!result)
    return res
      .status(404)
      .json({ success: false, message: "Fallo en eliminar producto" });
}
module.exports = deteleProductController;
