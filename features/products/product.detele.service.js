const db = require("../../db/database");

async function deteleProductSerices(id) {
  const [result] = await db.execute(
    "delete from railway.productos where id = ?",
    [id]
  );

  if (result.affectedRows === 1) {
    return true;
  } else {
    return false;
  }
}
module.exports = deteleProductSerices;
