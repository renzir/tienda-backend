const db = require("../../db/database");

async function deleteOrderService(id) {
  try {
    // Validación básica del ID
    if (!id || isNaN(id)) {
    return false;
  }

    const [result] = await db.execute(
      "DELETE FROM orden WHERE id = ?",
      [id]
    );

    return result.affectedRows === 1;
  } catch (error) {
    throw new Error(`Error al eliminar la orden: ${error.message}`);
}
}
module.exports = deleteOrderService;

