const db = require("../../db/database");

async function serviceGetProcucts() {
  const result = await db.execute("select * from railway.orden");

  if (result[0].length === 0) {
    return false;
  } else {
    return result[0];
  }
}
module.exports = serviceGetProcucts;
