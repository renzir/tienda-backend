const db = require("../../db/database");

async function getProducts() {
  const [products] = await db.execute("select * from railway.productos");
  return products || null;
}
module.exports = getProducts;
