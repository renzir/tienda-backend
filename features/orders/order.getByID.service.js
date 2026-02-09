const db = require("../../db/database");

async function serviceGetProcucts(id) {
  const result = await db.execute("select * from tienda.orden where id = ?", [
    id,
  ]);

  if (result[0].length == 0) {
    return false;
  } else {
    return result[0];
  }
}
module.exports = serviceGetProcucts;
