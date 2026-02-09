const db = require("../../../db/database");

async function getProductService(orderid) {
  const [rows] = await db.execute(
    "select * from tienda.ordenitems where orden_id = ?",
    [orderid],
  );

  if (rows.length === 0) {
    return { success: false, status: 404, message: "Producto no encontrado" };
  }
  return { success: true, status: 200, data: rows };
}
module.exports = getProductService;
