const getProducts = require("./product.get.service");

async function getProductsController(req, res, next) {
  try {
  const products = await getProducts();

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No hay productos" });
    }

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error); // Pasa el error al middleware de errores
  }
}

module.exports = getProductsController;

