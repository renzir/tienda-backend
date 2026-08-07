# 🛒 E-Commerce API (Backend)

Un backend robusto y funcional para un e-commerce, desarrollado con **Node.js**, **Express** y **MySQL**. Este proyecto fue concebido como un **proyecto de portafolio profesional** para demostrar el diseño e implementación de APIs RESTful con autenticación, transacciones seguras en base de datos y testing automatizado.

---

## 🎯 Objetivo del Proyecto

Demostrar buenas prácticas de desarrollo Backend, incluyendo:
- Arquitectura en capas (Rutas, Controladores, Servicios y Repositorios).
- Gestión de transacciones relacionales en MySQL para procesos críticos como la creación de órdenes y reserva de stock.
- Autenticación y autorización mediante Tokens JWT almacenados en Cookies HTTP-Only.
- Cobertura de pruebas unitarias e integración con Jest y Supertest.

---

## 🛠️ Tecnologías Utilizadas

- **Node.js** & **Express**
- **MySQL** (con driver `mysql2/promise` para soporte async/await y transacciones)
- **JSON Web Tokens (JWT)** & **Cookie-Parser**
- **Bcrypt** (para encriptación segura de contraseñas)
- **Jest** & **Supertest** (para testing unitario y de integración)
- **Swagger UI** (`swagger-jsdoc` & `swagger-ui-express`)

---

## 📋 Requisitos e Instalación

1. **Requisitos previos**: Node.js (v18+) y servidor MySQL (local o remoto).
2. **Clonar e instalar**:
   ```bash
   git clone <url-de-tu-repo>
   cd Backend
   npm install
   ```
3. **Configuración de entorno (`.env`)**:
   Crea un archivo `.env` en la raíz de `Backend/` con las siguientes variables:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3307
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=tienda
   JWT_SECRET=tu_clave_secreta_super_segura
   JWT_EXPIRES_IN=1d
   PORT=3000
   ```
4. **Sembrar base de datos con productos iniciales**:
   ```bash
   npm run seed
   ```
5. **Iniciar el servidor**:
   ```bash
   npm start
   ```

---

## 🧪 Pruebas y Documentación

- **Ejecutar tests**:
  ```bash
  npm test
  ```
- **Documentación Swagger**:
  Una vez iniciado el servidor, accede en tu navegador a:
  `http://localhost:3000/api-docs`

---

## 📌 Estado Actual y Futuras Mejoras (Out of Scope)

Este proyecto ha alcanzado su punto de cierre como demostración técnica para portafolio. Aunque es completamente funcional, para un entorno de producción real o iteraciones futuras se podrían incluir:

- **Migración a TypeScript**: Para añadir tipado estático estricto en controladores, servicios y repositorios.
- **Refresh Tokens & Revocación**: Implementar estrategia de tokens de refresco en base de datos/Redis para sesiones de larga duración más seguras.
- **Consultas y Filtrados Avanzados en MySQL**: Optimizar búsquedas con paginación (`LIMIT`/`OFFSET`), índices Full-Text para búsqueda por nombre/descripción, y filtrado dinámico por rangos de precio o categorías.
- **Gestión de Roles**: Implementar permisos RBAC (Admin, Cliente) para restricción fina de endpoints de creación/edición de productos.

