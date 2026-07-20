const getProductByID = require("./product.getByID.service");
const modifyProductByID = require("./product.modify.service");

async function modifyProductController(req, res, next) {
  try {
  const { id, nombre, precio, cantidad_disponible, cantidad_reservada } =
    req.body;

  const product = await getProductByID(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }
  const result = await modifyProductByID(
    nombre,
    precio,
    id,
    cantidad_disponible,
    cantidad_reservada
  );

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


