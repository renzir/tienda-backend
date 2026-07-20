async function deteleProductSerices(id) {
  const [result] = await db.execute(
    "DELETE FROM productos WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 1) {
    return true;
  } else {
    return false;
  }
}
