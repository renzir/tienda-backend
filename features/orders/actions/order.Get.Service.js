const db = require("../../../db/database");

async function getOrderItemsService(orderid) {
  try {
    // Validación básica del ID
    if (!orderid || isNaN(orderid)) {
      return { success: false, status: 400, message: "ID de orden inválido" };
    }

    const [rows] = await db.execute(
      "SELECT * FROM ordenitems WHERE orden_id = ?",
      [orderid],
    );

    if (rows.length === 0) {
      return { success: false, status: 404, message: "No se encontraron items para esta orden" };
    }
    
    return { success: true, status: 200, data: rows };
  } catch (error) {
    throw new Error(`Error al obtener los items de la orden: ${error.message}`);
  }
}

module.exports = getOrderItemsService;

