/**
 * Script para insertar productos semilla con categorías, descripciones e imágenes mock
 * Para ejecutarlo: node seedProducts.js
 */

const pool = require("./db/database");

const seedProducts = [
  {
    nombre: "Teclado Mecánico RGB Pro",
    descripcion: "Teclado mecánico con switches blue, retroiluminación RGB personalizable y diseño ergonómico para gaming y productividad.",
    categoria: "Periféricos",
    precio: 89.99,
    cantidad_disponible: 45,
    imagen_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60"
  },
  {
    nombre: "Mouse Inalámbrico Ergonomía Plus",
    descripcion: "Mouse óptico de alta precisión con sensor de 16000 DPI, conexión dual Bluetooth/2.4Ghz y batería recargable de larga duración.",
    categoria: "Periféricos",
    precio: 49.50,
    cantidad_disponible: 60,
    imagen_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60"
  },
  {
    nombre: "Monitor Gamer 27\" 144Hz IPS",
    descripcion: "Pantalla IPS de 27 pulgadas Full HD con resolución 1080p, tiempo de respuesta de 1ms, HDR10 y compatibilidad con FreeSync/G-Sync.",
    categoria: "Monitores",
    precio: 249.99,
    cantidad_disponible: 20,
    imagen_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60"
  },
  {
    nombre: "Auriculares Bluetooth Cancelación de Ruido ANC",
    descripcion: "Auriculares Over-Ear con cancelación activa de ruido (ANC), sonido Hi-Fi con graves profundos y hasta 30 horas de reproducción continua.",
    categoria: "Audio",
    precio: 119.00,
    cantidad_disponible: 35,
    imagen_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
  },
  {
    nombre: "Silla Gamer Ergonómica Premium",
    descripcion: "Silla de escritorio ergonómica con cojines lumbar y de cuello, reclinable 180°, apoyabrazos 4D y estructura de acero de alta resistencia.",
    categoria: "Mobiliario",
    precio: 199.90,
    cantidad_disponible: 15,
    imagen_url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&auto=format&fit=crop&q=60"
  },
  {
    nombre: "Webcam Full HD 1080p con Micrófono",
    descripcion: "Cámara web para streaming y videoconferencias con autoenfoque, micrófono estéreo con reducción de ruido y tapa de privacidad.",
    categoria: "Periféricos",
    precio: 39.99,
    cantidad_disponible: 50,
    imagen_url: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500&auto=format&fit=crop&q=60"
  },
  {
    nombre: "Disco Duro Externo SSD 1TB USB-C",
    descripcion: "Unidad de estado sólido portátil ultra rápida con velocidades de lectura de hasta 1050 MB/s, resistente a caídas y golpes.",
    categoria: "Almacenamiento",
    precio: 95.00,
    cantidad_disponible: 30,
    imagen_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=60"
  },
  {
    nombre: "Lámpara de Escritorio LED con Carga Inalámbrica",
    descripcion: "Lámpara LED regulable con 5 modos de color, control táctil, temporizador y base de carga rápida inalámbrica Qi para smartphones.",
    categoria: "Accesorios",
    precio: 34.99,
    cantidad_disponible: 40,
    imagen_url: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500&auto=format&fit=crop&q=60"
  }
];

async function seed() {
  try {
    const connection = await pool.getConnection();
    console.log("Conectado a la base de datos para sembrar productos...");

    // Intentamos asegurar que las columnas existan o insertamos con manejo defensivo
    for (const prod of seedProducts) {
      try {
        await connection.execute(
          `INSERT INTO productos (nombre, descripcion, categoria, precio, cantidad_disponible, imagen_url) 
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           descripcion = VALUES(descripcion),
           categoria = VALUES(categoria),
           precio = VALUES(precio),
           cantidad_disponible = VALUES(cantidad_disponible),
           imagen_url = VALUES(imagen_url)`,
          [prod.nombre, prod.descripcion, prod.categoria, prod.precio, prod.cantidad_disponible, prod.imagen_url]
        );
      } catch (err) {
        // En caso de que la tabla sólo tenga columnas básicas (nombre, precio, cantidad_disponible)
        if (err.code === 'ER_BAD_FIELD_ERROR') {
          await connection.execute(
            `INSERT INTO productos (nombre, precio, cantidad_disponible) 
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE precio = VALUES(precio), cantidad_disponible = VALUES(cantidad_disponible)`,
            [prod.nombre, prod.precio, prod.cantidad_disponible]
          );
        } else {
          throw err;
        }
      }
    }

    console.log("✅ Productos falso/semilla agregados exitosamente.");
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al sembrar productos:", error.message);
    process.exit(1);
  }
}

seed();
