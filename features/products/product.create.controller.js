const createProductServices = require("./product.create.services");
const getProductNameServices = require("./product.getByName.service");

async function createProductController(req, res) {
  const { nombre, precio, cantidad_disponible } = req.body;

  const product = await getProductNameServices(nombre);

  if (product)
    return res
      .status(409)
      .json({ success: false, message: "Producto ya existente" });

  const result = await createProductServices(
    nombre,
    precio,
    cantidad_disponible
  );

  if (result) {
    res.status(200).json({ success: true, message: "Producto creado" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Fallo en crear producto" });
  }
}
module.exports = createProductController;
