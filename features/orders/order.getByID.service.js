const db = require("../../db/database");

async function getOrderById(id) {
  try {
    // Validación básica del ID
    if (!id || isNaN(id)) {
      return null;
    }
    const result = await db.execute("SELECT * FROM orden WHERE id = ?", [id]);

    // Devolver el primer elemento si existe, o null si no hay resultados
    return result[0] && result[0].length > 0 ? result[0][0] : null;
  } catch (error) {
    throw new Error(`Error al obtener la orden: ${error.message}`);
  }
}

module.exports = getOrderById;

