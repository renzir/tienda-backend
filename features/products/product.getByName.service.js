const db = require("../../db/database");

async function getProductNameServices(nombre) {
  const [rows] = await db.execute(
    "select * from railway.productos where nombre = ?",
    [nombre]
  );

  if (rows.length !== 0) return rows[0]; // devuelve el primer producto
}
module.exports = getProductNameServices;
