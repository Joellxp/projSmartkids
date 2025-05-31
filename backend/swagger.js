const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartKids API',
      version: '1.0.0',
      description: 'Documentação da API do SmartKids',
    },
  },
  apis: ['./routes/*.js'], // Ajuste se suas rotas estiverem em outro local
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;