const db = require("../../db/database");

async function getProducts() {
  const [products] = await db.execute("select * from tienda.productos");
  return products || null;
}
module.exports = getProducts;
