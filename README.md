# 🛒 Backend Tienda API

Este es el backend de una aplicación de e-commerce desarrollado con Node.js, Express y MySQL.

## 🚀 Tecnologías utilizadas
- **Node.js** & **Express**
- **MySQL** (con `mysql2`)
- **JWT** (JSON Web Tokens para autenticación)
- **Bcrypt** (para hashing de contraseñas)
- **Jest** (para pruebas unitarias y de integración)
- **Swagger** (documentación de API)

## 📋 Requisitos previos
- Node.js (v16 o superior)
- MySQL Server

## ⚙️ Instalación

1. Clona el repositorio:
   `git clone <url-de-tu-repo>`
2. Instala las dependencias:
   `npm install`
3. Crea un archivo `.env` en la raíz basado en el archivo `.env.example` (ver abajo).
4. Ejecuta la aplicación:
   `npm start`

## 🧪 Pruebas
Para ejecutar el conjunto de pruebas:
`npm test`

## 📚 Documentación
Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de la API en:
`http://localhost:3000/api-docs`

---
## 🔑 Variables de Entorno (.env)
Crea un archivo `.env` en la raíz con las siguientes variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_de_tu_bd
JWT_SECRET=una_clave_muy_secreta_y_larga
JWT_EXPIRES_IN=1d
```
