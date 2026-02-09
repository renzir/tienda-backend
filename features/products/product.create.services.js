const db = require("../../db/database");

async function createProductServices(nombre, precio, cantidad_disponible) {
  const [result] = await db.execute(
    "insert into tienda.productos set nombre = ?, precio = ?, cantidad_disponible = ?",
    [nombre, precio, cantidad_disponible]
  );

  if (result.affectedRows == 1) {
    return true;
  } else {
    return false;
  }
}
module.exports = createProductServices;
