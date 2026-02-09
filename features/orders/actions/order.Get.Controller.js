
const getProductService = require("./order.Get.Service");

async function getProductController(req, res, next) {
  
  const { id } = req.params;

  try {
    const result = await getProductService(id);

   
    return res.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data || null 
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getProductController;
