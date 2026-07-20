const db = require("../../db/database");

async function modifyProductByIDServices(nombre, precio, id, cantidad_disponible, cantidad_reservada) {
  const [result] = await db.execute(
    "UPDATE productos SET nombre = ?, precio = ?, cantidad_disponible = ?, cantidad_reservada = ? WHERE id = ?",
    [nombre, precio, cantidad_disponible, cantidad_reservada, id]
  );
  return result;
}

module.exports = modifyProductByIDServices;

