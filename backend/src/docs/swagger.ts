import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PT-Maja Blog API",
      version: "1.0.0",
      description: "API de plataforma de blog para evaluacion tecnica"
    },
    servers: [{ url: "http://localhost:3000/api" }]
  },
  apis: []
});
