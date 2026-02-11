const orderRemoveService = require("./order.Remove.Service");

async function orderRemoveController(req, res, next) {
  const { order_id, product_id } = req;

  try {
    const result = await orderRemoveService(order_id, product_id);

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = orderRemoveController;
