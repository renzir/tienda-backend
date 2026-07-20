async function getProductNameServices(nombre) {
  const [rows] = await db.execute(
    "SELECT * FROM productos WHERE nombre = ?",
    [nombre]
  );

  if (rows.length !== 0) return rows[0]; // devuelve el primer producto
}

