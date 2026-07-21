const orderAddProductService = require("./order.AddProduct.service");
const { getProductByID } = require("../../products/product.services");

async function orderActionAdd(req, res, next) {
  const { cantidad } = req.body;
  const order_id = req.order_id;
  const product_id = req.product_id;
  try {
    const productbyid = await getProductByID(product_id);
    if (!productbyid || !productbyid.precio) {
      return res.status(404).json({
        success: false,
        message: "El producto que intentas añadir no existe",
      });
    }
    const result = await orderAddProductService(
      order_id,
      product_id,
      cantidad,
      productbyid.precio,
    );

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = orderActionAdd;
