const deteleProductSerices = require("./product.detele.service");

async function deteleProductController(req, res, next) {
  try {
  const id = req.id;

  const result = await deteleProductSerices(id);

  if (result)
    return res
      .status(200)
      .json({ success: true, message: "Producto eliminado" });

    return res
      .status(404)
      .json({ success: false, message: "Fallo en eliminar producto" });
  } catch (error) {
    next(error);
}
}
module.exports = deteleProductController;

