const orderCancelService = require("./order.Cancel.Service");

async function orderCancelController(req, res, next) {
  const { id } = req.params;

  try {
    const result = await orderCancelService(id);

    return res.status(result.status).json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

module.exports = orderCancelController;
