const db = require("../../db/database");

async function modifyOrderService(dato_usuario, direccion, id) {
  try {
    // Validación básica de entrada
    if (!dato_usuario || !direccion || !id) {
    return false;
  }

    const [result] = await db.execute(
      "UPDATE orden SET dato_usuario = ?, direccion = ? WHERE id = ?",
      [dato_usuario, direccion, id]
    );

    return result.affectedRows === 1;
  } catch (error) {
    throw new Error(`Error al modificar la orden: ${error.message}`);
}
}

module.exports = modifyOrderService;

