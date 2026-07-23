const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend API - Tienda',
      version: '1.0.0',
      description: 'Documentación técnica de la API de la tienda',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Escanea tus archivos de rutas
  apis: ['./features/**/*.router.js'], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;
