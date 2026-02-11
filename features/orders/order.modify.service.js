const db = require("../../db/database");

async function modifyProductByIDServices(dato_usuario, fecha, id) {

  const [result] = await db.execute(
    "update railway.orden set direccion = ?, dato_usuario = ? where id = ?",
    [fecha, dato_usuario, id]
  );

  if (result.affectedRows == 1) {
    return true;
  } else {
    return false;
  }
}
module.exports = modifyProductByIDServices;
