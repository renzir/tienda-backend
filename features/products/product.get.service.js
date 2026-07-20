const db = require("../../db/database");

async function getProducts() {
  const [products] = await db.execute("SELECT * FROM productos");
  return products || null;
}
module.exports = getProducts;
