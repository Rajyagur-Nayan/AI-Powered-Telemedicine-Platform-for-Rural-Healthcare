import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Telemedicine Platform API",
      version: "1.0.0",
      description: "API documentation for the Telemedicine Platform",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
    },
    /* security: [
      {
        cookieAuth: [],
      },
    ],*/
  },
  apis: ["./src/routes/*.js", "./src/routes/**/*.js"], // Files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
