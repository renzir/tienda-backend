const db = require("../../db/database");

async function getProductByID(id) {
  const [product] = await db.execute(
    "select * from tienda.productos where id = ?",
    [id]
  );

  return product[0] || null;
}
module.exports = getProductByID;
