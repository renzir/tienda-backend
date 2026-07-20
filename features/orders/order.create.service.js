const db = require("../../db/database");

async function orderCreateService(dato_usuario, direccion) {
  try {
    // Validación básica de entrada
    if (!dato_usuario || !direccion) {
      return { success: false, message: "Faltan datos requeridos" };
    }

    const [result] = await db.execute(
      "INSERT INTO orden (dato_usuario, direccion) VALUES (?, ?)",
      [dato_usuario, direccion]
    );

    if (result.affectedRows === 1) {
      return { success: true, orderId: result.insertId };
    }

    return { success: false, message: "No se pudo crear la orden" };
  } catch (error) {
    throw new Error(`Error al crear la orden: ${error.message}`);
  }
}

module.exports = orderCreateService;

