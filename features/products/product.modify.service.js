const db = require("../../db/database");

async function modifyProductByIDServices(nombre, precio, id, cantidad_disponible, cantidad_reservada) {
  const [result] = await db.execute(
    "update tienda.productos set nombre = ?, precio = ?, cantidad_disponible = ?, cantidad_reservada = ? where id = ?",
    [nombre, precio,cantidad_disponible, cantidad_reservada, id]
  );

  if (result.affectedRows == 1) {
    return true;
  } else {
    return false;
  }
}
module.exports = modifyProductByIDServices;
