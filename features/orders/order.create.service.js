const db = require("../../db/database");

async function orderCreateService(dato_usuario, direccion) {
  const [result] = await db.execute(
    "insert into tienda.orden set  dato_usuario = ?, direccion = ?",
    [dato_usuario, direccion],
  );

  if (result.affectedRows === 1) {
    return { success: true, orderId: result.insertId };
  }

  return { success: false };
}

module.exports = orderCreateService;
