const db = require("./../db/database"); // Importa el pool de conexión

async function testConnection() {
  try {
    console.log("Probando conexión con la base de datos...");

    // Ejecutar query SELECT * FROM una tabla (usaremos 'users' como ejemplo, pero puedes cambiarlo)
    const result = await db.query("SELECT * FROM productos"); // Cambia a tu tabla real si es necesario

    console.log("\n✅ Conexión exitosa!" + result);
    console.log(`Total de registros en la base de datos: ${result}`);
  } catch (error) {
    console.error("❌ Error al conectar o ejecutar consulta:", error.message);

    // Si quieres usar una tabla diferente, descomenta esta línea:
    // const result = await db.query('SELECT * FROM tu_tabla');
    return null;
  } finally {
    // Opcional: cerrar el pool si no lo necesitas más
    // await end();
  }
}

testConnection().catch(console.error);
