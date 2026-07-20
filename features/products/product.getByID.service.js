const db = require("../../db/database");

async function getProductByID(id) {
  const [product] = await db.execute(
    "SELECT * FROM productos WHERE id = ?",
    [id]
  );
  return product || null;
}
module.exports = getProductByID;

