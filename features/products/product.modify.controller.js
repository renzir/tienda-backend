const getProductByID = require("./product.getByID.service");
const modifyProductByID = require("./product.modify.service");

async function modifyProductController(req, res) {
  const { id, nombre, precio, cantidad_disponible, cantidad_reservada } =
    req.body;

  const product = await getProductByID(id);

  if (!product) throw new AppError("Producto no existe", 404);

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
  if (!result) {
    return res
      .status(204)
      .json({ success: false, message: "Modificacion incorrrecta" });
  }
}
module.exports = modifyProductController;
