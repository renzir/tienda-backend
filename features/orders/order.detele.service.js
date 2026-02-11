const db = require("../../db/database");

async function deteleOrderSerices(id) {
  const [result] = await db.execute(
    "delete from railway.orden where id = ?",
    [id]
  );

  if (result.affectedRows === 1) {
    return true;
  } else {
    return false;
  }
}
module.exports = deteleOrderSerices;
