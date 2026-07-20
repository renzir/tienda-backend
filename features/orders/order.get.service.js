const db = require("../../db/database");

async function getAllOrders() {
  try {
    const result = await db.execute("SELECT * FROM orden");
    return result[0] && result[0].length > 0 ? result[0] : null;
  } catch (error) {
    throw new Error(`Error al obtener las órdenes: ${error.message}`);
  }
}

module.exports = getAllOrders;

