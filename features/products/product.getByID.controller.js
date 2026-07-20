const getProductByID = require("./product.getByID.service");

async function getProductByIDController(req, res, next) {
  try {
  const id = req.id;
  const product = await getProductByID(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
  }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = getProductByIDController;

