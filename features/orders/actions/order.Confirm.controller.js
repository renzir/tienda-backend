
const orderConfirmService = require("./order.Confirm.Service");

async function orderConfirmController(req, res, next) {
  
  const { id } = req.params; 

  try {
    const result = await orderConfirmService(id);

    return res.status(result.status).json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    
    next(error);
  }
}

module.exports = orderConfirmController;
