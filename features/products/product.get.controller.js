const getProducts = require("./product.get.service");

async function getProductsController(req, res) {
  const products = await getProducts();

  if (products) {
    return res.status(200).json({
      success: true,
      data: products,
    });
  }

  if (!products) {
    return res
      .status(404)
      .json({ success: false, message: "No hay productos" });
  }
}

module.exports = getProductsController;
